import { readFileSync } from "node:fs";
import { read, utils } from "xlsx";

const a1Range =
  /^\$?[A-Z]{1,3}\$?[1-9]\d{0,6}(?::\$?[A-Z]{1,3}\$?[1-9]\d{0,6})?$/;

function parseRange(range) {
  const displayRange =
    typeof range === "string" ? range.trim().toUpperCase() : "";
  if (!a1Range.test(displayRange)) {
    throw new Error(`Excel 展示范围须使用 A1 格式，当前为 ${range}`);
  }

  const { s: start, e: end } = utils.decode_range(displayRange);
  if (
    end.r < start.r ||
    end.c < start.c ||
    end.r >= 1048576 ||
    end.c >= 16384
  ) {
    throw new Error(`Excel 展示范围无效：${displayRange}`);
  }

  return { start, end };
}

export function createExcelTableLoader({
  file,
  sheetName,
  range,
  headerRows = 1,
}) {
  const configuredRange = range === undefined ? undefined : parseRange(range);
  if (!Number.isInteger(headerRows) || headerRows < 0) {
    throw new Error(`表头行数须为非负整数，当前为 ${headerRows}`);
  }

  function load(files) {
    if (files.length !== 1) {
      throw new Error(
        `Excel 数据加载器需要一个文件，${file} 匹配到 ${files.length} 个`,
      );
    }

    const workbook = read(readFileSync(files[0]));
    const selectedSheetName = sheetName ?? workbook.SheetNames[0];
    const sheet = workbook.Sheets[selectedSheetName];
    if (!sheet?.["!ref"]) {
      throw new Error(
        `${file} 缺少工作表 ${selectedSheetName ?? "（第一张）"}，或该工作表为空`,
      );
    }

    const { start, end } = configuredRange ?? parseRange(sheet["!ref"]);
    const merges = sheet["!merges"] ?? [];
    if (!configuredRange) {
      // 有些文件的已用区域只包含合并单元格的左上角。
      for (const { s, e } of merges) {
        start.r = Math.min(start.r, s.r);
        start.c = Math.min(start.c, s.c);
        end.r = Math.max(end.r, e.r);
        end.c = Math.max(end.c, e.c);
      }
    }

    const rowCount = end.r - start.r + 1;
    if (headerRows > rowCount) {
      throw new Error(`表头行数 ${headerRows} 超出展示范围的 ${rowCount} 行`);
    }

    const bodyStart = start.r + headerRows;
    const spans = new Map();
    const covered = new Set();

    for (const { s, e } of merges) {
      if (e.r < start.r || s.r > end.r || e.c < start.c || s.c > end.c) {
        continue;
      }

      const address = utils.encode_range({ s, e });
      if (s.r < start.r || e.r > end.r || s.c < start.c || e.c > end.c) {
        const displayRange = utils.encode_range({ s: start, e: end });
        throw new Error(
          `${selectedSheetName} 的合并区域 ${address} 超出展示范围 ${displayRange}`,
        );
      }
      if (s.r < bodyStart && e.r >= bodyStart) {
        throw new Error(
          `${selectedSheetName} 的合并区域 ${address} 跨越表头和表体`,
        );
      }

      const anchor = utils.encode_cell(s);
      spans.set(anchor, { rowspan: e.r - s.r + 1, colspan: e.c - s.c + 1 });
      for (let r = s.r; r <= e.r; r++) {
        for (let c = s.c; c <= e.c; c++) {
          const cell = utils.encode_cell({ r, c });
          if (cell !== anchor) covered.add(cell);
        }
      }
    }

    const rows = [];
    for (let r = start.r; r <= end.r; r++) {
      const cells = [];
      for (let c = start.c; c <= end.c; c++) {
        const address = utils.encode_cell({ r, c });
        if (covered.has(address)) continue;

        cells.push({
          address,
          text: utils.format_cell(sheet[address]),
          ...spans.get(address),
        });
      }
      rows.push({ number: r + 1, cells });
    }

    return {
      head: rows.slice(0, headerRows),
      body: rows.slice(headerRows),
    };
  }

  // VitePress 以调用该方法的 .data.js 文件为基准解析 watch 路径。
  return { watch: [file], load };
}
