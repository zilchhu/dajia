using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Threading;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using GeneratedCode;

namespace d
{
  public class Record1
  {
    public string City { get; set; }
    public string Person { get; set; }
    public string Real_Shop { get; set; }
    public double? Income_Sum { get; set; }
    public double? Income_Avg { get; set; }
    public double? Income_Score { get; set; }
    public double? Cost_Sum { get; set; }
    public double? Cost_Avg { get; set; }
    public double? Cost_Sum_Ratio { get; set; }
    public double? Cost_Score { get; set; }
    public double? Consume_Sum { get; set; }
    public double? Consume_Avg { get; set; }
    public double? Consume_Sum_Ratio { get; set; }
    public double? Consume_Score { get; set; }
    public double? Score { get; set; }
    public double? Score_1 { get; set; }
    public double? Score_Avg { get; set; }
    public double? Score_Avg_1 { get; set; }
    public string Date { get; set; }

  }

  public class Record2
  {
    public string City { get; set; }
    public string Person { get; set; }
    public string Real_Shop { get; set; }
    public string Shop_Id { get; set; }
    public string Shop_Name { get; set; }
    public string Platform { get; set; }
    public double? Third_Send { get; set; }
    public double? Unit_Price { get; set; }
    public int? Orders { get; set; }
    public double? Income { get; set; }
    public double? Income_Avg { get; set; }
    public double? Income_Sum { get; set; }
    public double? Cost { get; set; }
    public double? Cost_Avg { get; set; }
    public double? Cost_Sum { get; set; }
    public double? Cost_Ratio { get; set; }
    public double? Cost_Sum_Ratio { get; set; }
    public double? Consume { get; set; }
    public double? Consume_Avg { get; set; }
    public double? Consume_Sum { get; set; }
    public double? Consume_Ratio { get; set; }
    public double? Consume_Sum_Ratio { get; set; }
    public double? Settlea_30 { get; set; }
    public double? Settlea_1 { get; set; }
    public double? Settlea_7 { get; set; }
    public double? Settlea_7_3 { get; set; }
    public string Date { get; set; }
  }

  public class ExcelData
  {
    public static HttpClient client => new HttpClient { BaseAddress = new Uri("http://192.168.3.3:9005/") };

    public static async Task<Record1[]> GetRecords1Async()
    {
      var records1 = new Record1[0];
      try
      {
        records1 = await client.GetFromJsonAsync<Record1[]>("export/perf");
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
      return records1;
    }

    public static async Task<Record2[]> GetRecords2Async()
    {
      var records2 = new Record2[0];
      try
      {
        records2 = await client.GetFromJsonAsync<Record2[]>("export/op");
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
      return records2;
    }

  }

  public class ExcelBuilder
  {
    public static int InsertSharedStringItem(string text, SharedStringTablePart shareStringPart)
    {
      // If the part does not contain a SharedStringTable, create one.
      if (shareStringPart.SharedStringTable == null)
      {
        shareStringPart.SharedStringTable = new SharedStringTable();
      }

      int i = 0;

      // Iterate through all the items in the SharedStringTable. If the text already exists, return its index.
      foreach (SharedStringItem item in shareStringPart.SharedStringTable.Elements<SharedStringItem>())
      {
        if (item.InnerText == text)
        {
          return i;
        }

        i++;
      }

      // The text does not exist in the part. Create the SharedStringItem and return its index.
      shareStringPart.SharedStringTable.AppendChild(new SharedStringItem(new DocumentFormat.OpenXml.Spreadsheet.Text(text)));
      shareStringPart.SharedStringTable.Save();

      return i;
    }

    public static Cell CreateStringCell(string refer, string val, SharedStringTablePart sstPart)
    {
      var index = InsertSharedStringItem(val, sstPart);
      var cell = new Cell { CellReference = refer, DataType = CellValues.SharedString, CellValue = new CellValue(index.ToString()) };
      return cell;
    }

    public static string toColName(int num)
    {
      var AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var name = "";
      var dividend = num;
      int rest;
      while (dividend > 0)
      {
        rest = (dividend - 1) % 26;
        name = AZ[rest] + name;
        dividend = (dividend - rest) / 26;
      }
      return name;
    }


    public static async Task BuildTable1()
    {
      var data = await ExcelData.GetRecords1Async();
      var colLen = 19;
      var yesterday = DateTime.Today.AddDays(-1).ToString("yyyyMMdd");

      var doc = SpreadsheetDocument.Create(@$"D:\G\d\files\绩效表{yesterday}.xlsx", SpreadsheetDocumentType.Workbook);
      var workbookPart = doc.AddWorkbookPart();

      var sstPart = workbookPart.AddNewPart<SharedStringTablePart>("r6");
      // style
      var workbookStylesPart = workbookPart.AddNewPart<WorkbookStylesPart>();
      DifferentialFormats differentialFormats = new DifferentialFormats { Count = 2 };
      differentialFormats.AppendChild(new DifferentialFormat
      {
        Fill = new Fill
        {
          PatternFill = new PatternFill
          {
            PatternType = new EnumValue<PatternValues>(PatternValues.Solid),
            BackgroundColor = new BackgroundColor { Rgb = "FFFF0000" }
          }
        }
      });
      Fonts fonts = new Fonts { Count = 1 };
      fonts.AppendChild(new Font
      {
        FontSize = new FontSize { Val = 11.0 },
        Color = new Color { Theme = 1 },
        FontName = new FontName { Val = "宋体" }
      });
      fonts.AppendChild(new Font
      {
        Bold = new Bold(),
        FontSize = new FontSize { Val = 12.0 },
        Color = new Color { Theme = 1 },
        FontName = new FontName { Val = "微软雅黑" },
        FontCharSet = new FontCharSet { Val = 134 }
      });
      Borders borders = new Borders { Count = 2 };
      borders.AppendChild(new Border
      {
        LeftBorder = new LeftBorder(),
        RightBorder = new RightBorder(),
        TopBorder = new TopBorder(),
        BottomBorder = new BottomBorder(),
        DiagonalBorder = new DiagonalBorder()
      });
      borders.AppendChild(new Border
      {
        LeftBorder = new LeftBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        RightBorder = new RightBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Dashed), Color = new Color { Rgb = "FFFF0000" } },
        TopBorder = new TopBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        BottomBorder = new BottomBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        // DiagonalBorder = new DiagonalBorder()
      });
      Fills fills = new Fills { Count = 3 };
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill { PatternType = new EnumValue<PatternValues>(PatternValues.None) }
      });
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill { PatternType = new EnumValue<PatternValues>(PatternValues.Gray125) }
      });
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill
        {
          PatternType = new EnumValue<PatternValues>(PatternValues.Solid),
          ForegroundColor = new ForegroundColor { Rgb = "FFFFFF00" },
        }
      });

      CellStyleFormats cellStyleFormats = new CellStyleFormats { Count = 1 };
      cellStyleFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 1, BorderId = 0 });

      CellFormats cellFormats = new CellFormats { Count = 2 };
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0 });
      cellFormats.AppendChild(new CellFormat
      {
        NumberFormatId = 0,
        FontId = 0,
        FillId = 2,
        BorderId = 0,
        FormatId = 0,
        // Alignment = new Alignment
        // {
        //   Horizontal = new EnumValue<HorizontalAlignmentValues>(HorizontalAlignmentValues.Center),
        //   Vertical = new EnumValue<VerticalAlignmentValues>(VerticalAlignmentValues.Center)
        // },
        ApplyFont = false,
        ApplyFill = true,
        ApplyBorder = false,
        ApplyAlignment = false
      });
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 10, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0, ApplyNumberFormat = true });
      // CellStyles cellStyles = new CellStyles { Count = 1 };
      // cellStyles.AppendChild(new CellStyle { Name = "Normal", FormatId = 0, BuiltinId = 0 });

      Stylesheet stylesheet = new Stylesheet
      {
        Fonts = fonts,
        Borders = borders,
        Fills = fills,
        CellStyleFormats = cellStyleFormats,
        CellFormats = cellFormats
        // CellStyles = cellStyles,
        // DifferentialFormats = differentialFormats
      };

      workbookStylesPart.Stylesheet = stylesheet;


      // sheet.xml  x:worksheet
      var sheetPart = workbookPart.AddNewPart<WorksheetPart>("r1");
      var sheetViews = new SheetViews();
      sheetViews.Append(new SheetView
      {
        WorkbookViewId = 0,
        Pane = new Pane { HorizontalSplit = 3, State = PaneStateValues.Frozen, TopLeftCell = "D1", ActivePane = PaneValues.TopRight }
      });
      var sheet = new Worksheet
      {
        SheetDimension = new SheetDimension { Reference = $"A1:{toColName(colLen)}{data.Length + 1}" },
        SheetViews = sheetViews
      };
      sheetPart.Worksheet = sheet;

      // var cols = new Columns();
      // cols.Append(
      //   new Column { Min = 9, Max = 9, Width = 10, BestFit = true, Style = 2 },
      //   new Column { Min = 13, Max = 13, Width = 10, BestFit = true, Style = 2 }
      // );
      // shhet.xml  x:sheetData
      var sheetData = new SheetData();
      var headerRow = new Row { RowIndex = 1, StyleIndex = 1, CustomFormat = true };
      var A = CreateStringCell("A1", "城市", sstPart);
      A.StyleIndex = 1;
      var B = CreateStringCell("B1", "负责人", sstPart);
      B.StyleIndex = 1;
      var C = CreateStringCell("C1", "物理店", sstPart);
      C.StyleIndex = 1;
      var D = CreateStringCell("D1", "收入", sstPart);
      D.StyleIndex = 1;
      var E = CreateStringCell("E1", "平均收入", sstPart);
      E.StyleIndex = 1;
      var F = CreateStringCell("F1", "收入分", sstPart);
      F.StyleIndex = 1;
      var G = CreateStringCell("G1", "成本", sstPart);
      G.StyleIndex = 1;
      var H = CreateStringCell("H1", "平均成本", sstPart);
      H.StyleIndex = 1;
      var I = CreateStringCell("I1", "成本比例", sstPart);
      I.StyleIndex = 1;
      var J = CreateStringCell("J1", "成本分", sstPart);
      J.StyleIndex = 1;
      var K = CreateStringCell("K1", "推广", sstPart);
      K.StyleIndex = 1;
      var L = CreateStringCell("L1", "平均推广", sstPart);
      L.StyleIndex = 1;
      var M = CreateStringCell("M1", "推广比例", sstPart);
      M.StyleIndex = 1;
      var N = CreateStringCell("N1", "推广分", sstPart);
      N.StyleIndex = 1;
      var O = CreateStringCell("O1", "分数", sstPart);
      O.StyleIndex = 1;
      var P = CreateStringCell("P1", "分数变化", sstPart);
      P.StyleIndex = 1;
      var Q = CreateStringCell("Q1", "平均分", sstPart);
      Q.StyleIndex = 1;
      var R = CreateStringCell("R1", "平均分变化", sstPart);
      R.StyleIndex = 1;
      var S = CreateStringCell("S1", "日期", sstPart);
      S.StyleIndex = 1;
      headerRow.Append(
        A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S
      );
      sheetData.Append(headerRow);
      uint dataIndex = 2;

      foreach (var v in data)
      {
        var row = new Row { RowIndex = dataIndex, Hidden = v.Date != yesterday };
        row.Append(
          CreateStringCell($"A{dataIndex}", v.City, sstPart),
          CreateStringCell($"B{dataIndex}", v.Person, sstPart),
          CreateStringCell($"C{dataIndex}", v.Real_Shop, sstPart),
          v?.Income_Sum != null ? new Cell { CellReference = $"D{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Sum) } : null,
          v?.Income_Avg != null ? new Cell { CellReference = $"E{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Avg) } : null,
          v?.Income_Score != null ? new Cell { CellReference = $"F{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Score) } : null,
          v?.Cost_Sum != null ? new Cell { CellReference = $"G{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum) } : null,
          v?.Cost_Avg != null ? new Cell { CellReference = $"H{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Avg) } : null,
          v?.Cost_Sum_Ratio != null ? new Cell { CellReference = $"I{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum_Ratio), StyleIndex = 2 } : null,
          v?.Cost_Score != null ? new Cell { CellReference = $"J{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Score) } : null,
          v?.Consume_Sum != null ? new Cell { CellReference = $"K{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum) } : null,
          v?.Consume_Avg != null ? new Cell { CellReference = $"L{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Avg) } : null,
          v?.Consume_Sum_Ratio != null ? new Cell { CellReference = $"M{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum_Ratio), StyleIndex = 2 } : null,
          v?.Consume_Score != null ? new Cell { CellReference = $"N{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Score) } : null,
          v?.Score != null ? new Cell { CellReference = $"O{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Score) } : null,
          v?.Score_1 != null ? new Cell { CellReference = $"P{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Score_1) } : null,
          v?.Score_Avg != null ? new Cell { CellReference = $"Q{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Score_Avg) } : null,
          v?.Score_Avg_1 != null ? new Cell { CellReference = $"R{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Score_Avg_1) } : null,
          CreateStringCell($"S{dataIndex}", v.Date, sstPart)
        );
        sheetData.Append(row);
        dataIndex++;
      }
      sheet.Append(sheetData);

      AutoFilter autoFilter = new AutoFilter { Reference = $"A1:{toColName(colLen)}{data.Length + 1}" };
      CustomFilters customFilters = new CustomFilters();
      customFilters.AppendChild(new CustomFilter { Val = yesterday });
      autoFilter.AppendChild(new FilterColumn { ColumnId = 18, CustomFilters = customFilters });
      sheet.Append(autoFilter);

      // pivot d
      var pcPart = workbookPart.AddNewPart<PivotTableCacheDefinitionPart>("r3");
      var cacheSource = new CacheSource { Type = SourceValues.Worksheet };
      cacheSource.Append(new WorksheetSource { Sheet = "sheet1", Reference = $"A1:{toColName(colLen)}{data.Length + 1}" });

      var cacheFields = new CacheFields { Count = (uint)colLen };
      var cities = data.Select(v => v.City).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si1 = new SharedItems { Count = (uint)cities.LongCount() };
      si1.Append(cities.Select(v => new StringItem { Val = v.Val }));
      var persons = data.Select(v => v.Person).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si2 = new SharedItems { Count = (uint)persons.LongCount() };
      si2.Append(persons.Select(v => new StringItem { Val = v.Val }));
      var realShops = data.Select(v => v.Real_Shop).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si3 = new SharedItems { Count = (uint)realShops.LongCount() };
      si3.Append(realShops.Select(v => new StringItem { Val = v.Val }));
      var dates = data.Select(v => v.Date).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si19 = new SharedItems { Count = (uint)dates.LongCount() };
      si19.Append(dates.Select(v => new StringItem { Val = v.Val }));
      cacheFields.Append(
        new CacheField { Name = "城市", SharedItems = si1 }, // 1
        new CacheField { Name = "负责人", SharedItems = si2 },
        new CacheField { Name = "物理店", SharedItems = si3 },
        new CacheField { Name = "收入", SharedItems = new SharedItems() },
        new CacheField { Name = "平均收入", SharedItems = new SharedItems() }, // 5
        new CacheField { Name = "收入分", SharedItems = new SharedItems() },
        new CacheField { Name = "成本", SharedItems = new SharedItems() },
        new CacheField { Name = "平均成本", SharedItems = new SharedItems() },
        new CacheField { Name = "成本比例", SharedItems = new SharedItems() },
        new CacheField { Name = "成本分", SharedItems = new SharedItems() }, // 10
        new CacheField { Name = "推广", SharedItems = new SharedItems() },
        new CacheField { Name = "平均推广", SharedItems = new SharedItems() },
        new CacheField { Name = "推广比例", SharedItems = new SharedItems() },
        new CacheField { Name = "推广分", SharedItems = new SharedItems() },
        new CacheField { Name = "分数", SharedItems = new SharedItems() }, // 15
        new CacheField { Name = "分数变化", SharedItems = new SharedItems() },
        new CacheField { Name = "平均分", SharedItems = new SharedItems() },
        new CacheField { Name = "平均分变化", SharedItems = new SharedItems() },
        new CacheField { Name = "日期", SharedItems = si19 }
      );

      var pc = new PivotCacheDefinition
      {
        Id = "r1",
        CreatedVersion = 6,
        RefreshedVersion = 6,
        MinRefreshableVersion = 3,
        RefreshedBy = "Excel Services",
        RecordCount = (uint)data.Length,
        CacheSource = cacheSource,
        CacheFields = cacheFields
      };
      pcPart.PivotCacheDefinition = pc;


      // pivot r
      var pcrPart = pcPart.AddNewPart<PivotTableCacheRecordsPart>("r1");
      var pcr = new PivotCacheRecords { Count = (uint)data.Length };
      var rs = data.Select(v =>
      {
        var r = new PivotCacheRecord();
        r.Append(
          new FieldItem { Val = (uint)cities.First(K => K.Val == v.City).Index },
          new FieldItem { Val = (uint)persons.First(k => k.Val == v.Person).Index },
          new FieldItem { Val = (uint)realShops.First(k => k.Val == v.Real_Shop).Index },
          new NumberItem { Val = v.Income_Sum },
          new NumberItem { Val = v.Income_Avg },
          new NumberItem { Val = v.Income_Score },
          new NumberItem { Val = v.Cost_Sum },
          new NumberItem { Val = v.Cost_Avg },
          new NumberItem { Val = v.Cost_Sum_Ratio },
          new NumberItem { Val = v.Cost_Score },
          new NumberItem { Val = v.Consume_Sum },
          new NumberItem { Val = v.Consume_Avg },
          new NumberItem { Val = v.Consume_Sum_Ratio },
          new NumberItem { Val = v.Consume_Score },
          new NumberItem { Val = v.Score },
          new NumberItem { Val = v.Score_1 },
          new NumberItem { Val = v.Score_Avg },
          new NumberItem { Val = v.Score_Avg_1 },
          new FieldItem { Val = (uint)dates.First(k => k.Val == v.Date).Index }
        );
        return r;
      });
      pcr.Append(rs);
      pcrPart.PivotCacheRecords = pcr;


      // pivot t    sheet2.xml
      var sheetPart2 = workbookPart.AddNewPart<WorksheetPart>("r2");
      var sheet2 = new Worksheet(); // SheetDimension = new SheetDimension { Reference = $"A3:{toColName((int)dates.LongCount() + 2 - 1)}{realShops.LongCount() + 3 + 2}" }
      var sheetData2 = new SheetData();
      sheet2.Append(sheetData2);
      sheetPart2.Worksheet = sheet2;

      var ptPart = sheetPart2.AddNewPart<PivotTablePart>("r1");
      ptPart.AddPart(pcPart, "r1");
      // // name="PivotTable1" cacheId="5804" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" 
      // // dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"

      var pfs = new PivotFields { Count = 19 };
      var pf2 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      var items2 = new Items { Count = (uint)persons.LongCount() + 1 };
      items2.Append(
        Enumerable.Range(0, (int)persons.LongCount()).Select(v => new Item { Index = (uint)v })
      );
      items2.Append(new Item { ItemType = ItemValues.Default });
      pf2.Append(items2);

      var pf19 = new PivotField { Axis = PivotTableAxisValues.AxisColumn, SortType = FieldSortValues.Descending };
      var items19 = new Items { Count = (uint)dates.LongCount() + 1 };
      items19.Append(
        Enumerable.Range(0, (int)dates.LongCount()).Select(v => new Item { Index = (uint)v }).Reverse()
      );
      items19.Append(new Item { ItemType = ItemValues.Default });
      pf19.Append(items19);
      pfs.Append(
        new PivotField(),
        pf2,
        new PivotField(),
        new PivotField { DataField = true }
      );
      pfs.Append(Enumerable.Range(0, 14).Select(v => new PivotField()));
      pfs.Append(pf19);

      var rfs = new RowFields { Count = 1 };
      rfs.Append(new Field { Index = 1 });
      var ris = new RowItems { Count = (uint)persons.Count() + 1 };
      var ri = new RowItem();
      ri.Append(new MemberPropertyIndex());
      ris.Append(ri);
      foreach (var i in Enumerable.Range(1, persons.Count() - 1))
      {
        var r = new RowItem();
        r.Append(new MemberPropertyIndex { Val = i });
        ris.Append(r);

        // var rri = new RowItem { RepeatedItemCount = 1 };
        // rri.Append(new MemberPropertyIndex());
        // ris.Append(rri);
        // foreach (var j in Enumerable.Range(1, platforms.Count() - 1))
        // {
        //   var rr = new RowItem { RepeatedItemCount = 1 };
        //   rr.Append(new MemberPropertyIndex { Val = j });
        //   ris.Append(rr);
        // }
      }
      var rig = new RowItem { ItemType = ItemValues.Grand };
      rig.Append(new MemberPropertyIndex());
      ris.Append(rig);

      var cfs = new ColumnFields { Count = 1 };
      cfs.Append(new Field { Index = 18 });
      var cis = new ColumnItems { Count = (uint)dates.LongCount() + 1 };
      var ci = new RowItem();
      ci.Append(new MemberPropertyIndex());
      cis.Append(ci);
      foreach (var i in Enumerable.Range(1, dates.Count() - 1))
      {
        var r = new RowItem();
        r.Append(new MemberPropertyIndex { Val = i });
        cis.Append(r);
      }
      var cig = new RowItem { ItemType = ItemValues.Grand };
      cig.Append(new MemberPropertyIndex());
      cis.Append(cig);
      var dfs = new DataFields { Count = 1 };
      dfs.Append(new DataField { Name = "收入", Field = 3 });
      var pt = new PivotTableDefinition
      {
        Name = "pivotTable1",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A3:{toColName(dates.Count() + 2)}{persons.Count() + 5}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs,
        RowFields = rfs,
        RowItems = ris,
        ColumnFields = cfs,
        ColumnItems = cis,
        DataFields = dfs
      };
      // applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      ptPart.PivotTableDefinition = pt;


      // pivot t2
      var ptPart2 = sheetPart2.AddNewPart<PivotTablePart>("r2");
      ptPart2.AddPart(pcPart, "r1");
      var pfs2 = new PivotFields { Count = 19 };
      pfs2.Append(
        new PivotField(),
        pf2.CloneNode(true)
      );
      pfs2.Append(Enumerable.Range(0, 6).Select(v => new PivotField()));
      pfs2.Append(new PivotField { DataField = true });
      pfs2.Append(Enumerable.Range(0, 9).Select(v => new PivotField()));
      pfs2.Append(pf19.CloneNode(true));

      var dfs2 = new DataFields { Count = 1 };
      dfs2.Append(new DataField { Name = "成本比例", Field = 8, Subtotal = DataConsolidateFunctionValues.Average, NumberFormatId = 10 });
      var pt2 = new PivotTableDefinition
      {
        Name = "pivotTable2",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A{3 + persons.Count() + 5}:{toColName(dates.Count() + 2)}{(persons.Count() + 5) * 2}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs2,
        RowFields = (RowFields)rfs.CloneNode(true),
        RowItems = (RowItems)ris.CloneNode(true),
        ColumnFields = (ColumnFields)cfs.CloneNode(true),
        ColumnItems = (ColumnItems)cis.CloneNode(true),
        DataFields = dfs2
      };
      ptPart2.PivotTableDefinition = pt2;


      // pivot t3
      var ptPart3 = sheetPart2.AddNewPart<PivotTablePart>("r3");
      ptPart3.AddPart(pcPart, "r1");
      var pfs3 = new PivotFields { Count = 19 };
      pfs3.Append(
        new PivotField(),
        pf2.CloneNode(true)
      );
      pfs3.Append(Enumerable.Range(0, 10).Select(v => new PivotField()));
      pfs3.Append(new PivotField { DataField = true });
      pfs3.Append(Enumerable.Range(0, 5).Select(v => new PivotField()));
      pfs3.Append(pf19.CloneNode(true));

      var dfs3 = new DataFields { Count = 1 };
      dfs3.Append(new DataField { Name = "推广比例", Field = 12, Subtotal = DataConsolidateFunctionValues.Average, NumberFormatId = 10 });
      var pt3 = new PivotTableDefinition
      {
        Name = "pivotTable3",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A{3 + (persons.Count() + 5) * 2}:{toColName(dates.Count() + 2)}{(persons.Count() + 5) * 3}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs3,
        RowFields = (RowFields)rfs.CloneNode(true),
        RowItems = (RowItems)ris.CloneNode(true),
        ColumnFields = (ColumnFields)cfs.CloneNode(true),
        ColumnItems = (ColumnItems)cis.CloneNode(true),
        DataFields = dfs3
      };
      ptPart3.PivotTableDefinition = pt3;


      // pivot t4
      var ptPart4 = sheetPart2.AddNewPart<PivotTablePart>("r4");
      ptPart4.AddPart(pcPart, "r1");
      var pfs4 = new PivotFields { Count = 19 };
      pfs4.Append(
        new PivotField(),
        pf2.CloneNode(true)
      );
      pfs4.Append(Enumerable.Range(0, 14).Select(v => new PivotField()));
      pfs4.Append(new PivotField { DataField = true });
      pfs4.Append(new PivotField());
      pfs4.Append(pf19.CloneNode(true));

      var dfs4 = new DataFields { Count = 1 };
      dfs4.Append(new DataField { Name = "平均分", Field = 16, Subtotal = DataConsolidateFunctionValues.Average });
      var pt4 = new PivotTableDefinition
      {
        Name = "pivotTable4",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A{3 + (persons.Count() + 5) * 3}:{toColName(dates.Count() + 2)}{(persons.Count() + 5) * 4}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs4,
        RowFields = (RowFields)rfs.CloneNode(true),
        RowItems = (RowItems)ris.CloneNode(true),
        ColumnFields = (ColumnFields)cfs.CloneNode(true),
        ColumnItems = (ColumnItems)cis.CloneNode(true),
        DataFields = dfs4
      };
      ptPart4.PivotTableDefinition = pt4;


      // pivot t5
      var ptPart5 = sheetPart2.AddNewPart<PivotTablePart>("r5");
      ptPart5.AddPart(pcPart, "r1");
      var pfs5 = new PivotFields { Count = 19 };
      pfs5.Append(
        new PivotField(),
        pf2.CloneNode(true)
      );
      pfs5.Append(Enumerable.Range(0, 15).Select(v => new PivotField()));
      pfs5.Append(new PivotField { DataField = true });
      pfs5.Append(pf19.CloneNode(true));

      var dfs5 = new DataFields { Count = 1 };
      dfs5.Append(new DataField { Name = "平均分变化", Field = 17, Subtotal = DataConsolidateFunctionValues.Average });
      var pt5 = new PivotTableDefinition
      {
        Name = "pivotTable5",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A{3 + (persons.Count() + 5) * 4}:{toColName(dates.Count() + 2)}{(persons.Count() + 5) * 5}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs5,
        RowFields = (RowFields)rfs.CloneNode(true),
        RowItems = (RowItems)ris.CloneNode(true),
        ColumnFields = (ColumnFields)cfs.CloneNode(true),
        ColumnItems = (ColumnItems)cis.CloneNode(true),
        DataFields = dfs5
      };
      ptPart5.PivotTableDefinition = pt5;
      // pivot t2
      // var ptPart_2 = sheetPart2.AddNewPart<PivotTablePart>("r2");
      // ptPart_2.AddPart(pcPart, "r1");
      // // // name="PivotTable1" cacheId="5804" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" 
      // // // dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"

      // var pfs_2 = new PivotFields { Count = 6 };

      // var pf1_2 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      // var items1_2 = new Items { Count = (uint)realShops.LongCount() + 1 };
      // items1_2.Append(
      //   Enumerable.Range(0, (int)realShops.LongCount()).Select(v => new Item { Index = (uint)v })
      // );
      // items1_2.Append(new Item { ItemType = ItemValues.Default });
      // pf1_2.Append(items1_2);
      // var pf2_2 = new PivotField { Axis = PivotTableAxisValues.AxisColumn, SortType = FieldSortValues.Descending };
      // var items2_2 = new Items { Count = (uint)dates.LongCount() + 1 };
      // items2_2.Append(
      //   Enumerable.Range(0, (int)dates.LongCount()).Select(v => new Item { Index = (uint)v }).Reverse()
      // );
      // items2_2.Append(new Item { ItemType = ItemValues.Default });
      // pf2_2.Append(items2_2);
      // pfs_2.Append(
      //   new PivotField(),
      //   pf1_2,
      //   new PivotField(),
      //   new PivotField(),
      //   new PivotField { DataField = true },
      //   pf2_2
      // );
      // var rfs_2 = new RowFields { Count = 1 };
      // rfs_2.Append(new Field { Index = 1 });
      // var ris_2 = new RowItems { Count = (uint)(realShops.Count()) + 1 };
      // var ri_2 = new RowItem();
      // ri_2.Append(new MemberPropertyIndex());
      // ris_2.Append(ri_2);
      // foreach (var i in Enumerable.Range(1, realShops.Count() - 1))
      // {
      //   var r = new RowItem();
      //   r.Append(new MemberPropertyIndex { Val = i });
      //   ris_2.Append(r);
      // }
      // var rig_2 = new RowItem { ItemType = ItemValues.Grand };
      // rig_2.Append(new MemberPropertyIndex());
      // ris_2.Append(rig_2);

      // var cfs_2 = new ColumnFields { Count = 1 };
      // cfs_2.Append(new Field { Index = 5 });
      // var cis_2 = new ColumnItems { Count = (uint)realShops.LongCount() + 1 };
      // var ci_2 = new RowItem();
      // ci_2.Append(new MemberPropertyIndex());
      // cis_2.Append(ci_2);
      // foreach (var i in Enumerable.Range(1, dates.Count() - 1))
      // {
      //   var r = new RowItem();
      //   r.Append(new MemberPropertyIndex { Val = i });
      //   cis_2.Append(r);
      // }
      // var cig_2 = new RowItem { ItemType = ItemValues.Grand };
      // cig_2.Append(new MemberPropertyIndex());
      // cis_2.Append(cig_2);
      // var dfs_2 = new DataFields { Count = 1 };
      // dfs_2.Append(new DataField { Name = "Sum of Consume", Field = 4 });
      // var pt_2 = new PivotTableDefinition
      // {
      //   Name = "pivotTable2",
      //   CacheId = 1,
      //   CreatedVersion = 6,
      //   UpdatedVersion = 6,
      //   MinRefreshableVersion = 3,
      //   DataCaption = "Values",
      //   Location = new Location { Reference = $"A{realShops.Count() * (platforms.Count() + 1) + 3 + 2 + 2}:{toColName((int)dates.LongCount() + 2 - 1)}{realShops.Count() * (platforms.Count() + 1) + 3 + 2 + 2 + realShops.Count() + 2}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
      //   PivotFields = pfs_2,
      //   RowFields = rfs_2,
      //   RowItems = ris_2,
      //   ColumnFields = cfs_2,
      //   ColumnItems = cis_2,
      //   DataFields = dfs_2
      // };
      // // applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      // ptPart_2.PivotTableDefinition = pt_2;


      // var autoFilter = new AutoFilter { Reference = $"A1:F{data.Length + 1}" };
      // var customFilters = new CustomFilters();
      // customFilters.AppendChild(new CustomFilter { Operator = new EnumValue<FilterOperatorValues>(FilterOperatorValues.Equal), Val = $"{dataLast?.Date}" });
      // autoFilter.AppendChild(new FilterColumn { ColumnId = 5, CustomFilters = customFilters });

      // sheet.Append(sheetData, autoFilter);
      // sheet2.Append(sheetData2);


      var sheets = new Sheets();
      sheets.Append(
        new Sheet { Id = "r1", Name = "sheet1", SheetId = 1 },
        new Sheet { Id = "r2", Name = "sheet2", SheetId = 2 }
      );

      var pivotCaches = new PivotCaches();
      pivotCaches.Append(new PivotCache { CacheId = 1, Id = "r3" });
      workbookPart.Workbook = new Workbook { Sheets = sheets, PivotCaches = pivotCaches };

      // var pivotCaches = new PivotCaches();
      // pivotCaches.Append(new PivotCache { CacheId = 0, Id = "rpcdPart1" });
      // workbookPart.Workbook.Append(pivotCaches);

      doc.Save();
      doc.Close();
    }


    public static async Task BuildTable2()
    {
      var data = await ExcelData.GetRecords2Async();
      var colLen = 27;
      var yesterday = DateTime.Today.AddDays(-1).ToString("yyyyMMdd");

      var doc = SpreadsheetDocument.Create(@$"D:\G\d\files\营推表{yesterday}.xlsx", SpreadsheetDocumentType.Workbook);
      var workbookPart = doc.AddWorkbookPart();

      var sstPart = workbookPart.AddNewPart<SharedStringTablePart>("r6");
      // style
      var workbookStylesPart = workbookPart.AddNewPart<WorkbookStylesPart>();
      DifferentialFormats differentialFormats = new DifferentialFormats { Count = 1 };
      differentialFormats.AppendChild(new DifferentialFormat
      {
        Fill = new Fill
        {
          PatternFill = new PatternFill
          {
            PatternType = new EnumValue<PatternValues>(PatternValues.Solid),
            BackgroundColor = new BackgroundColor { Rgb = "FFFF0000" }
          }
        }
      });
      Fonts fonts = new Fonts { Count = 1 };
      fonts.AppendChild(new Font
      {
        FontSize = new FontSize { Val = 11.0 },
        Color = new Color { Theme = 1 },
        FontName = new FontName { Val = "宋体" }
      });
      fonts.AppendChild(new Font
      {
        Bold = new Bold(),
        FontSize = new FontSize { Val = 12.0 },
        Color = new Color { Theme = 1 },
        FontName = new FontName { Val = "微软雅黑" },
        FontCharSet = new FontCharSet { Val = 134 }
      });
      Borders borders = new Borders { Count = 2 };
      borders.AppendChild(new Border
      {
        LeftBorder = new LeftBorder(),
        RightBorder = new RightBorder(),
        TopBorder = new TopBorder(),
        BottomBorder = new BottomBorder(),
        DiagonalBorder = new DiagonalBorder()
      });
      borders.AppendChild(new Border
      {
        LeftBorder = new LeftBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        RightBorder = new RightBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Dashed), Color = new Color { Rgb = "FFFF0000" } },
        TopBorder = new TopBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        BottomBorder = new BottomBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        // DiagonalBorder = new DiagonalBorder()
      });
      Fills fills = new Fills { Count = 3 };
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill { PatternType = new EnumValue<PatternValues>(PatternValues.None) }
      });
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill { PatternType = new EnumValue<PatternValues>(PatternValues.Gray125) }
      });
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill
        {
          PatternType = new EnumValue<PatternValues>(PatternValues.Solid),
          ForegroundColor = new ForegroundColor { Rgb = "FFFFFF00" },
        }
      });

      CellStyleFormats cellStyleFormats = new CellStyleFormats { Count = 1 };
      cellStyleFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 1, BorderId = 0 });

      CellFormats cellFormats = new CellFormats { Count = 3 };
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0 });
      cellFormats.AppendChild(new CellFormat
      {
        NumberFormatId = 0,
        FontId = 0,
        FillId = 2,
        BorderId = 0,
        FormatId = 0,
        // Alignment = new Alignment
        // {
        //   Horizontal = new EnumValue<HorizontalAlignmentValues>(HorizontalAlignmentValues.Center),
        //   Vertical = new EnumValue<VerticalAlignmentValues>(VerticalAlignmentValues.Center)
        // },
        ApplyFont = false,
        ApplyFill = true,
        ApplyBorder = false,
        ApplyAlignment = false
      });
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 10, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0, ApplyNumberFormat = true });
      // CellStyles cellStyles = new CellStyles { Count = 1 };
      // cellStyles.AppendChild(new CellStyle { Name = "Normal", FormatId = 0, BuiltinId = 0 });

      Stylesheet stylesheet = new Stylesheet
      {
        Fonts = fonts,
        Borders = borders,
        Fills = fills,
        CellStyleFormats = cellStyleFormats,
        CellFormats = cellFormats,
        // CellStyles = cellStyles,
        DifferentialFormats = differentialFormats
      };

      workbookStylesPart.Stylesheet = stylesheet;


      // sheet.xml  x:worksheet
      var sheetPart = workbookPart.AddNewPart<WorksheetPart>("r1");
      var sheetViews = new SheetViews();
      sheetViews.Append(new SheetView
      {
        WorkbookViewId = 0,
        Pane = new Pane { HorizontalSplit = 6, State = PaneStateValues.Frozen, TopLeftCell = "G1", ActivePane = PaneValues.TopRight }
      });
      var sheet = new Worksheet
      {
        SheetDimension = new SheetDimension { Reference = $"A1:{toColName(colLen)}{data.Length + 1}" },
        SheetViews = sheetViews
      };
      sheetPart.Worksheet = sheet;

      // var cols = new Columns();
      // cols.Append(
      //   new Column { Min = 9, Max = 9, Width = 10, BestFit = true, Style = 2 },
      //   new Column { Min = 13, Max = 13, Width = 10, BestFit = true, Style = 2 }
      // );
      // shhet.xml  x:sheetData
      var sheetData = new SheetData();
      var headerRow = new Row { RowIndex = 1, StyleIndex = 1, CustomFormat = true };
      var A = CreateStringCell("A1", "城市", sstPart);
      A.StyleIndex = 1;
      var B = CreateStringCell("B1", "负责人", sstPart);
      B.StyleIndex = 1;
      var C = CreateStringCell("C1", "物理店", sstPart);
      C.StyleIndex = 1;
      var D = CreateStringCell("D1", "门店ID", sstPart);
      D.StyleIndex = 1;
      var E = CreateStringCell("E1", "门店", sstPart);
      E.StyleIndex = 1;
      var F = CreateStringCell("F1", "平台", sstPart);
      F.StyleIndex = 1;
      var G = CreateStringCell("G1", "三方配送", sstPart);
      G.StyleIndex = 1;
      var H = CreateStringCell("H1", "单价", sstPart);
      H.StyleIndex = 1;
      var I = CreateStringCell("I1", "订单", sstPart);
      I.StyleIndex = 1;
      var J = CreateStringCell("J1", "收入", sstPart);
      J.StyleIndex = 1;
      var K = CreateStringCell("K1", "平均收入", sstPart);
      K.StyleIndex = 1;
      var L = CreateStringCell("L1", "总收入", sstPart);
      L.StyleIndex = 1;
      var M = CreateStringCell("M1", "成本", sstPart);
      M.StyleIndex = 1;
      var N = CreateStringCell("N1", "平均成本", sstPart);
      N.StyleIndex = 1;
      var O = CreateStringCell("O1", "总成本", sstPart);
      O.StyleIndex = 1;
      var P = CreateStringCell("P1", "成本比例", sstPart);
      P.StyleIndex = 1;
      var Q = CreateStringCell("Q1", "总成本比例", sstPart);
      Q.StyleIndex = 1;
      var R = CreateStringCell("R1", "推广", sstPart);
      R.StyleIndex = 1;
      var S = CreateStringCell("S1", "平均推广", sstPart);
      S.StyleIndex = 1;
      var T = CreateStringCell("T1", "总推广", sstPart);
      T.StyleIndex = 1;
      var U = CreateStringCell("U1", "推广比例", sstPart);
      U.StyleIndex = 1;
      var V = CreateStringCell("V1", "总推广比例", sstPart);
      V.StyleIndex = 1;
      var W = CreateStringCell("W1", "比30天", sstPart);
      W.StyleIndex = 1;
      var X = CreateStringCell("X1", "比上天", sstPart);
      X.StyleIndex = 1;
      var Y = CreateStringCell("Y1", "比上周", sstPart);
      Y.StyleIndex = 1;
      var Z = CreateStringCell("Z1", "比上周(3)", sstPart);
      Z.StyleIndex = 1;
      var AA = CreateStringCell("AA1", "日期", sstPart);
      AA.StyleIndex = 1;
      headerRow.Append(
        A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA
      );
      sheetData.Append(headerRow);
      uint dataIndex = 2;

      foreach (var v in data)
      {
        var row = new Row { RowIndex = dataIndex, Hidden = v.Date != yesterday };
        row.Append(
          CreateStringCell($"A{dataIndex}", v.City, sstPart),
          CreateStringCell($"B{dataIndex}", v.Person, sstPart),
          CreateStringCell($"C{dataIndex}", v.Real_Shop, sstPart),
          CreateStringCell($"D{dataIndex}", v.Shop_Id, sstPart),
          CreateStringCell($"E{dataIndex}", v.Shop_Name, sstPart),
          CreateStringCell($"F{dataIndex}", v.Platform, sstPart),
          v?.Third_Send != null ? new Cell { CellReference = $"G{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Third_Send) } : null,
          v?.Unit_Price != null ? new Cell { CellReference = $"H{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Unit_Price) } : null,
          v?.Orders != null ? new Cell { CellReference = $"I{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Orders) } : null,
          v?.Income != null ? new Cell { CellReference = $"J{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income) } : null,
          v?.Income_Avg != null ? new Cell { CellReference = $"K{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Avg) } : null,
          v?.Income_Sum != null ? new Cell { CellReference = $"L{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Sum) } : null,
          v?.Cost != null ? new Cell { CellReference = $"M{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost) } : null,
          v?.Cost_Avg != null ? new Cell { CellReference = $"N{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Avg) } : null,
          v?.Cost_Sum != null ? new Cell { CellReference = $"O{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum) } : null,
          v?.Cost_Ratio != null ? new Cell { CellReference = $"P{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Ratio), StyleIndex = 2 } : null,
          v?.Cost_Sum_Ratio != null ? new Cell { CellReference = $"Q{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum_Ratio), StyleIndex = 2 } : null,
          v?.Consume != null ? new Cell { CellReference = $"R{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume) } : null,
          v?.Consume_Avg != null ? new Cell { CellReference = $"S{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Avg) } : null,
          v?.Consume_Sum != null ? new Cell { CellReference = $"T{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum) } : null,
          v?.Consume_Ratio != null ? new Cell { CellReference = $"U{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Ratio), StyleIndex = 2 } : null,
          v?.Consume_Sum_Ratio != null ? new Cell { CellReference = $"V{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum_Ratio), StyleIndex = 2 } : null,
          v?.Settlea_30 != null ? new Cell { CellReference = $"W{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Settlea_30), StyleIndex = 2 } : null,
          v?.Settlea_1 != null ? new Cell { CellReference = $"X{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Settlea_1), StyleIndex = 2 } : null,
          v?.Settlea_7 != null ? new Cell { CellReference = $"Y{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Settlea_7), StyleIndex = 2 } : null,
          v?.Settlea_7_3 != null ? new Cell { CellReference = $"Z{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Settlea_7_3), StyleIndex = 2 } : null,
          CreateStringCell($"AA{dataIndex}", v.Date, sstPart)
        );
        sheetData.Append(row);
        dataIndex++;
      }
      sheet.Append(sheetData);

      AutoFilter autoFilter = new AutoFilter { Reference = $"A1:{toColName(colLen)}{data.Length + 1}" };
      CustomFilters customFilters = new CustomFilters();
      customFilters.AppendChild(new CustomFilter { Val = yesterday });
      autoFilter.AppendChild(new FilterColumn { ColumnId = 26, CustomFilters = customFilters });
      sheet.Append(autoFilter);

      StringValue[] srf = { $"P2:P{data.Length + 1}" };
      ConditionalFormatting cf = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf) };
      var cfRule = new ConditionalFormattingRule
      {
        Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
        FormatId = 0,
        Priority = 1,
        Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
      };
      cfRule.AppendChild(new Formula("0.5"));
      cf.AppendChild(cfRule);

      StringValue[] srf2 = { $"U2:U{data.Length + 1}" };
      ConditionalFormatting cf2 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf2) };
      var cfRule2 = new ConditionalFormattingRule
      {
        Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
        FormatId = 0,
        Priority = 2,
        Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
      };
      cfRule2.AppendChild(new Formula("0.05"));
      cf2.AppendChild(cfRule2);

      StringValue[] srf3 = { $"K2:K{data.Length + 1}" };
      ConditionalFormatting cf3 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf3) };
      var cfRule3 = new ConditionalFormattingRule
      {
        Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
        FormatId = 0,
        Priority = 3,
        Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.LessThan)
      };
      cfRule3.AppendChild(new Formula("1500"));
      cf3.AppendChild(cfRule3);

      StringValue[] srf4 = { $"J2:J{data.Length + 1}" };
      ConditionalFormatting cf4 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf4) };
      var cfRule4 = new ConditionalFormattingRule
      {
        Type = ConditionalFormatValues.Expression,
        FormatId = 0,
        Priority = 3
      };
      cfRule4.AppendChild(new Formula("OR(AND($F2=\"美团\",$J2<1500),AND($F2=\"饿了么\",$J2<1000))"));
      cf4.AppendChild(cfRule4);
      sheet.Append(cf, cf2, cf3, cf4);

      // pivot d
      var pcPart = workbookPart.AddNewPart<PivotTableCacheDefinitionPart>("r3");
      var cacheSource = new CacheSource { Type = SourceValues.Worksheet };
      cacheSource.Append(new WorksheetSource { Sheet = "sheet1", Reference = $"A1:{toColName(colLen)}{data.Length + 1}" });

      var cacheFields = new CacheFields { Count = (uint)colLen };
      var cities = data.Select(v => v.City).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si1 = new SharedItems { Count = (uint)cities.LongCount() };
      si1.Append(cities.Select(v => new StringItem { Val = v.Val }));
      var persons = data.Select(v => v.Person).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si2 = new SharedItems { Count = (uint)persons.LongCount() };
      si2.Append(persons.Select(v => new StringItem { Val = v.Val }));
      var realShops = data.Select(v => v.Real_Shop).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si3 = new SharedItems { Count = (uint)realShops.LongCount() };
      si3.Append(realShops.Select(v => new StringItem { Val = v.Val }));
      var shopIds = data.Select(v => v.Shop_Id).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si4 = new SharedItems { Count = (uint)shopIds.LongCount() };
      si4.Append(shopIds.Select(v => new StringItem { Val = v.Val }));
      var shopNames = data.Select(v => v.Shop_Name).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si5 = new SharedItems { Count = (uint)shopNames.LongCount() };
      si5.Append(shopNames.Select(v => new StringItem { Val = v.Val }));
      var platforms = data.Select(v => v.Platform).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si6 = new SharedItems { Count = (uint)platforms.LongCount() };
      si6.Append(platforms.Select(v => new StringItem { Val = v.Val }));
      var dates = data.Select(v => v.Date).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si27 = new SharedItems { Count = (uint)dates.LongCount() };
      si27.Append(dates.Select(v => new StringItem { Val = v.Val }));
      cacheFields.Append(
        new CacheField { Name = "城市", SharedItems = si1 }, // 1
        new CacheField { Name = "负责人", SharedItems = si2 },
        new CacheField { Name = "物理店", SharedItems = si3 },
        new CacheField { Name = "门店ID", SharedItems = si4 }, // 1
        new CacheField { Name = "门店", SharedItems = si5 },
        new CacheField { Name = "平台", SharedItems = si6 },
        new CacheField { Name = "三方配送", SharedItems = new SharedItems() },
        new CacheField { Name = "单价", SharedItems = new SharedItems() }, // 5
        new CacheField { Name = "订单", SharedItems = new SharedItems() },
        new CacheField { Name = "收入", SharedItems = new SharedItems() },
        new CacheField { Name = "平均收入", SharedItems = new SharedItems() },
        new CacheField { Name = "总收入", SharedItems = new SharedItems() },
        new CacheField { Name = "成本", SharedItems = new SharedItems() }, // 10
        new CacheField { Name = "平均成本", SharedItems = new SharedItems() },
        new CacheField { Name = "总成本", SharedItems = new SharedItems() },
        new CacheField { Name = "成本比例", SharedItems = new SharedItems() },
        new CacheField { Name = "总成本比例", SharedItems = new SharedItems() },
        new CacheField { Name = "推广", SharedItems = new SharedItems() }, // 15
        new CacheField { Name = "平均推广", SharedItems = new SharedItems() },
        new CacheField { Name = "总推广", SharedItems = new SharedItems() },
        new CacheField { Name = "推广比例", SharedItems = new SharedItems() },
        new CacheField { Name = "总推广比例", SharedItems = new SharedItems() },
        new CacheField { Name = "比30日", SharedItems = new SharedItems() },
        new CacheField { Name = "比上天", SharedItems = new SharedItems() },
        new CacheField { Name = "比上周", SharedItems = new SharedItems() },
        new CacheField { Name = "比上周(3)", SharedItems = new SharedItems() },
        new CacheField { Name = "日期", SharedItems = si27 }
      );

      var pc = new PivotCacheDefinition
      {
        Id = "r1",
        CreatedVersion = 6,
        RefreshedVersion = 6,
        MinRefreshableVersion = 3,
        RefreshedBy = "Excel Services",
        RecordCount = (uint)data.Length,
        CacheSource = cacheSource,
        CacheFields = cacheFields
      };
      pcPart.PivotCacheDefinition = pc;


      // pivot r
      var pcrPart = pcPart.AddNewPart<PivotTableCacheRecordsPart>("r1");
      var pcr = new PivotCacheRecords { Count = (uint)data.Length };
      var rs = data.Select(v =>
      {
        var r = new PivotCacheRecord();
        r.Append(
          new FieldItem { Val = (uint)cities.First(K => K.Val == v.City).Index },
          new FieldItem { Val = (uint)persons.First(k => k.Val == v.Person).Index },
          new FieldItem { Val = (uint)realShops.First(k => k.Val == v.Real_Shop).Index },
          new FieldItem { Val = (uint)shopIds.First(K => K.Val == v.Shop_Id).Index },
          new FieldItem { Val = (uint)shopNames.First(k => k.Val == v.Shop_Name).Index },
          new FieldItem { Val = (uint)platforms.First(k => k.Val == v.Platform).Index },
          new NumberItem { Val = v.Third_Send },
          new NumberItem { Val = v.Unit_Price },
          new NumberItem { Val = v.Orders },
          new NumberItem { Val = v.Income },
          new NumberItem { Val = v.Income_Avg },
          new NumberItem { Val = v.Income_Sum },
          new NumberItem { Val = v.Cost },
          new NumberItem { Val = v.Cost_Avg },
          new NumberItem { Val = v.Cost_Sum },
          new NumberItem { Val = v.Cost_Ratio },
          new NumberItem { Val = v.Cost_Sum_Ratio },
          new NumberItem { Val = v.Consume },
          new NumberItem { Val = v.Consume_Avg },
          new NumberItem { Val = v.Consume_Sum },
          new NumberItem { Val = v.Consume_Ratio },
          new NumberItem { Val = v.Consume_Sum_Ratio },
          new NumberItem { Val = v.Settlea_30 },
          new NumberItem { Val = v.Settlea_1 },
          new NumberItem { Val = v.Settlea_7 },
          new NumberItem { Val = v.Settlea_7_3 },
          new FieldItem { Val = (uint)dates.First(k => k.Val == v.Date).Index }
        );
        return r;
      });
      pcr.Append(rs);
      pcrPart.PivotCacheRecords = pcr;


      // pivot t    sheet2.xml
      var sheetPart2 = workbookPart.AddNewPart<WorksheetPart>("r2");
      var sheet2 = new Worksheet(); // SheetDimension = new SheetDimension { Reference = $"A3:{toColName((int)dates.LongCount() + 2 - 1)}{realShops.LongCount() + 3 + 2}" }
      var sheetData2 = new SheetData();
      sheet2.Append(sheetData2);
      sheetPart2.Worksheet = sheet2;

      var ptPart = sheetPart2.AddNewPart<PivotTablePart>("r1");
      ptPart.AddPart(pcPart, "r1");
      // // name="PivotTable1" cacheId="5804" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" 
      // // dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"

      var pfs = new PivotFields { Count = 27 };
      var pf3 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      var items3 = new Items { Count = (uint)realShops.LongCount() + 1 };
      items3.Append(
        Enumerable.Range(0, (int)realShops.LongCount()).Select(v => new Item { Index = (uint)v })
      );
      items3.Append(new Item { ItemType = ItemValues.Default });
      pf3.Append(items3);

      var pf6 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      var items6 = new Items { Count = (uint)platforms.LongCount() + 1 };
      items6.Append(
        Enumerable.Range(0, (int)platforms.LongCount()).Select(v => new Item { Index = (uint)v })
      );
      items6.Append(new Item { ItemType = ItemValues.Default });
      pf6.Append(items6);

      var pf27 = new PivotField { Axis = PivotTableAxisValues.AxisColumn, SortType = FieldSortValues.Descending };
      var items27 = new Items { Count = (uint)dates.LongCount() + 1 };
      items27.Append(
        Enumerable.Range(0, (int)dates.LongCount()).Select(v => new Item { Index = (uint)v }).Reverse()
      );
      items27.Append(new Item { ItemType = ItemValues.Default });
      pf27.Append(items27);
      pfs.Append(
        new PivotField(),
        new PivotField(),
        pf3,
        new PivotField(),
        new PivotField(),
        pf6
      );
      pfs.Append(Enumerable.Range(0, 3).Select(v => new PivotField()));
      pfs.Append(new PivotField { DataField = true });
      pfs.Append(Enumerable.Range(0, 16).Select(v => new PivotField()));
      pfs.Append(pf27);

      var rfs = new RowFields { Count = 2 };
      rfs.Append(new Field { Index = 2 }, new Field { Index = 5 });
      var ris = new RowItems { Count = (uint)(realShops.Count() * platforms.Count()) + 1 };
      var ri = new RowItem();
      ri.Append(new MemberPropertyIndex());
      ris.Append(ri);
      foreach (var i in Enumerable.Range(1, realShops.Count() - 1))
      {
        var r = new RowItem();
        r.Append(new MemberPropertyIndex { Val = i });
        ris.Append(r);

        var rri = new RowItem { RepeatedItemCount = 1 };
        rri.Append(new MemberPropertyIndex());
        ris.Append(rri);
        foreach (var j in Enumerable.Range(1, platforms.Count() - 1))
        {
          var rr = new RowItem { RepeatedItemCount = 1 };
          rr.Append(new MemberPropertyIndex { Val = j });
          ris.Append(rr);
        }
      }
      var rig = new RowItem { ItemType = ItemValues.Grand };
      rig.Append(new MemberPropertyIndex());
      ris.Append(rig);

      var cfs = new ColumnFields { Count = 1 };
      cfs.Append(new Field { Index = 26 });
      var cis = new ColumnItems { Count = (uint)dates.LongCount() + 1 };
      var ci = new RowItem();
      ci.Append(new MemberPropertyIndex());
      cis.Append(ci);
      foreach (var i in Enumerable.Range(1, dates.Count() - 1))
      {
        var r = new RowItem();
        r.Append(new MemberPropertyIndex { Val = i });
        cis.Append(r);
      }
      var cig = new RowItem { ItemType = ItemValues.Grand };
      cig.Append(new MemberPropertyIndex());
      cis.Append(cig);
      var dfs = new DataFields { Count = 1 };
      dfs.Append(new DataField { Name = "收入", Field = 9 });
      var pt = new PivotTableDefinition
      {
        Name = "pivotTable1",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A3:{toColName(dates.Count() + 2)}{realShops.Count() * platforms.Count() + 5}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs,
        RowFields = rfs,
        RowItems = ris,
        ColumnFields = cfs,
        ColumnItems = cis,
        DataFields = dfs
      };
      // applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      ptPart.PivotTableDefinition = pt;


      // pivot t2
      var sheetPart3 = workbookPart.AddNewPart<WorksheetPart>("r33");
      var sheet3 = new Worksheet(); // SheetDimension = new SheetDimension { Reference = $"A3:{toColName((int)dates.LongCount() + 2 - 1)}{realShops.LongCount() + 3 + 2}" }
      var sheetData3 = new SheetData();
      sheet3.Append(sheetData3);
      sheetPart3.Worksheet = sheet3;

      var ptPart2 = sheetPart3.AddNewPart<PivotTablePart>("r2");
      ptPart2.AddPart(pcPart, "r1");
      // // name="PivotTable1" cacheId="5804" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" 
      // // dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      var pfs2 = new PivotFields { Count = 27 };
      pfs2.Append(
        new PivotField(),
        new PivotField(),
        pf3.CloneNode(true),
        new PivotField(),
        new PivotField(),
        pf6.CloneNode(true)
      );
      pfs2.Append(Enumerable.Range(0, 6).Select(v => new PivotField()));
      pfs2.Append(new PivotField { DataField = true });
      pfs2.Append(Enumerable.Range(0, 13).Select(v => new PivotField()));
      pfs2.Append(pf27.CloneNode(true));
      var dfs2 = new DataFields { Count = 1 };
      dfs2.Append(new DataField { Name = "成本", Field = 12 });
      var pt2 = new PivotTableDefinition
      {
        Name = "pivotTable2",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A3:{toColName(dates.Count() + 2)}{realShops.Count() * platforms.Count() + 5}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs2,
        RowFields = (RowFields)rfs.CloneNode(true),
        RowItems = (RowItems)ris.CloneNode(true),
        ColumnFields = (ColumnFields)cfs.CloneNode(true),
        ColumnItems = (ColumnItems)cis.CloneNode(true),
        DataFields = dfs2
      };
      // applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      ptPart2.PivotTableDefinition = pt2;


      // pivot t3
      var sheetPart4 = workbookPart.AddNewPart<WorksheetPart>("r4");
      var sheet4 = new Worksheet(); // SheetDimension = new SheetDimension { Reference = $"A3:{toColName((int)dates.LongCount() + 2 - 1)}{realShops.LongCount() + 3 + 2}" }
      var sheetData4 = new SheetData();
      sheet4.Append(sheetData4);
      sheetPart4.Worksheet = sheet4;

      var ptPart3 = sheetPart4.AddNewPart<PivotTablePart>("r3");
      ptPart3.AddPart(pcPart, "r1");
      // // name="PivotTable1" cacheId="5804" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" 
      // // dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      var pfs3 = new PivotFields { Count = 27 };
      pfs3.Append(
        new PivotField(),
        new PivotField(),
        pf3.CloneNode(true),
        new PivotField(),
        new PivotField(),
        pf6.CloneNode(true)
      );
      pfs3.Append(Enumerable.Range(0, 11).Select(v => new PivotField()));
      pfs3.Append(new PivotField { DataField = true });
      pfs3.Append(Enumerable.Range(0, 8).Select(v => new PivotField()));
      pfs3.Append(pf27.CloneNode(true));
      var dfs3 = new DataFields { Count = 1 };
      dfs3.Append(new DataField { Name = "推广", Field = 17 });
      var pt3 = new PivotTableDefinition
      {
        Name = "pivotTable3",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A3:{toColName(dates.Count() + 2)}{realShops.Count() * platforms.Count() + 5}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs3,
        RowFields = (RowFields)rfs.CloneNode(true),
        RowItems = (RowItems)ris.CloneNode(true),
        ColumnFields = (ColumnFields)cfs.CloneNode(true),
        ColumnItems = (ColumnItems)cis.CloneNode(true),
        DataFields = dfs3
      };
      // applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      ptPart3.PivotTableDefinition = pt3;


      var sheets = new Sheets();
      sheets.Append(
        new Sheet { Id = "r1", Name = "sheet1", SheetId = 1 },
        new Sheet { Id = "r2", Name = "收入汇总", SheetId = 2 },
        new Sheet { Id = "r33", Name = "成本汇总", SheetId = 3 },
        new Sheet { Id = "r4", Name = "推广汇总", SheetId = 4 }
      );

      var pivotCaches = new PivotCaches();
      pivotCaches.Append(new PivotCache { CacheId = 1, Id = "r3" });
      workbookPart.Workbook = new Workbook { Sheets = sheets, PivotCaches = pivotCaches };

      doc.Save();
      doc.Close();
    }

  }


  public class WebServer
  {
    private readonly Semaphore _sem;

    private readonly HttpListener _listener;

    public WebServer(int concurrentCount)
    {
      _sem = new Semaphore(concurrentCount, concurrentCount);
      _listener = new HttpListener();
    }

    public void Bind(string url)
    {
      _listener.Prefixes.Add(url);
    }

    public void Start()
    {
      _listener.Start();

      Task.Run(async () =>
      {
        while (true)
        {
          _sem.WaitOne();
          var context = await _listener.GetContextAsync();
          _sem.Release();
          HandleRequest(context);
        }
      });
    }

    private async Task HandleRequest(HttpListenerContext context)
    {
      var request = context.Request;
      var response = context.Response;
      var urlPath = request.Url.LocalPath.TrimStart('/');
      Console.WriteLine($"url path={urlPath}");

      string filePath = Path.Combine("files", urlPath);

      if (!File.Exists(filePath) && urlPath.Contains("绩效表"))
      {
        await ExcelBuilder.BuildTable1();
      }

      try
      {

        byte[] data = File.ReadAllBytes(filePath);
        response.ContentType = "application/excel";
        response.ContentLength64 = data.Length;
        // response.ContentEncoding = Encoding.UTF8;
        response.SendChunked = true;
        response.StatusCode = 200;
        response.OutputStream.Write(data, 0, data.Length);
        response.OutputStream.Close();
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        Console.WriteLine(ex.StackTrace);
      }
    }
  }

  class Program
  {
    // Given text and a SharedStringTablePart, creates a SharedStringItem with the specified text 
    // and inserts it into the SharedStringTablePart. If the item already exists, returns its index.
    private static int InsertSharedStringItem(string text, SharedStringTablePart shareStringPart)
    {
      // If the part does not contain a SharedStringTable, create one.
      if (shareStringPart.SharedStringTable == null)
      {
        shareStringPart.SharedStringTable = new SharedStringTable();
      }

      int i = 0;

      // Iterate through all the items in the SharedStringTable. If the text already exists, return its index.
      foreach (SharedStringItem item in shareStringPart.SharedStringTable.Elements<SharedStringItem>())
      {
        if (item.InnerText == text)
        {
          return i;
        }

        i++;
      }

      // The text does not exist in the part. Create the SharedStringItem and return its index.
      shareStringPart.SharedStringTable.AppendChild(new SharedStringItem(new DocumentFormat.OpenXml.Spreadsheet.Text(text)));
      shareStringPart.SharedStringTable.Save();

      return i;
    }

    private static void MergeTwoCells(Worksheet worksheet, string cell1Name, string cell2Name)
    {
      MergeCells mergeCells;
      if (worksheet.Elements<MergeCells>().Count() > 0)
      {
        mergeCells = worksheet.Elements<MergeCells>().First();
      }
      else
      {
        mergeCells = new MergeCells();

        // Insert a MergeCells object into the specified position.
        if (worksheet.Elements<CustomSheetView>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<CustomSheetView>().First());
        }
        else if (worksheet.Elements<DataConsolidate>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<DataConsolidate>().First());
        }
        else if (worksheet.Elements<SortState>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<SortState>().First());
        }
        else if (worksheet.Elements<AutoFilter>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<AutoFilter>().First());
        }
        else if (worksheet.Elements<Scenarios>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<Scenarios>().First());
        }
        else if (worksheet.Elements<ProtectedRanges>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<ProtectedRanges>().First());
        }
        else if (worksheet.Elements<SheetProtection>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<SheetProtection>().First());
        }
        else if (worksheet.Elements<SheetCalculationProperties>().Count() > 0)
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<SheetCalculationProperties>().First());
        }
        else
        {
          worksheet.InsertAfter(mergeCells, worksheet.Elements<SheetData>().First());
        }
      }

      // Create the merged cell and append it to the MergeCells collection.
      MergeCell mergeCell = new MergeCell() { Reference = new StringValue(cell1Name + ":" + cell2Name) };
      mergeCells.Append(mergeCell);

    }

    public static void CreateSpreadsheetWorkbook(string filepath)
    {
      // Create a spreadsheet document by supplying the filepath.
      // By default, AutoSave = true, Editable = true, and Type = xlsx.
      SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(filepath, SpreadsheetDocumentType.Workbook);

      // Add a WorkbookPart to the document.
      WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
      workbookpart.Workbook = new Workbook();

      // Add a WorksheetPart to the WorkbookPart.
      WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();

      worksheetPart.Worksheet = new Worksheet { SheetProperties = new SheetProperties { FilterMode = true } };
      worksheetPart.Worksheet.AppendChild(new SheetData());
      // Add a Table
      // TableParts tableParts = new TableParts();
      // Table table = new Table { Id = 1, Name = "Table1", DisplayName = "Table1" };
      // TablePart tablePart = new TablePart { Id = "rId1" };
      // tableParts.AppendChild(tablePart);
      // worksheetPart.Worksheet.AppendChild(tableParts);

      // Add Sheets to the Workbook.
      Sheets sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild<Sheets>(new Sheets());

      // Append a new worksheet and associate it with the workbook.
      Sheet sheet = new Sheet { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "mySheet" };
      sheets.Append(sheet);

      // Get the sheetData cell table.
      SheetData sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

      // Add a row to the cell table.
      Row row;
      row = new Row { RowIndex = 1 };
      sheetData.Append(row);

      // In the new row, find the column location to insert a cell in A1.  
      // Cell refCell = null;
      // foreach (Cell cell in row.Elements<Cell>())
      // {
      //   if (string.Compare(cell.CellReference.Value, "A1", true) > 0)
      //   {
      //     refCell = cell;
      //     break;
      //   }
      // }

      // Add the cell to the cell table at A1.
      SharedStringTablePart shareStringPart;
      if (spreadsheetDocument.WorkbookPart.GetPartsOfType<SharedStringTablePart>().Count() > 0)
      {
        shareStringPart = spreadsheetDocument.WorkbookPart.GetPartsOfType<SharedStringTablePart>().First();
      }
      else
      {
        shareStringPart = spreadsheetDocument.WorkbookPart.AddNewPart<SharedStringTablePart>();
      }


      WorkbookStylesPart workbookStylesPart;
      if (spreadsheetDocument.WorkbookPart.GetPartsOfType<WorkbookStylesPart>().Count() > 0)
      {
        workbookStylesPart = spreadsheetDocument.WorkbookPart.GetPartsOfType<WorkbookStylesPart>().First();
      }
      else
      {
        workbookStylesPart = spreadsheetDocument.WorkbookPart.AddNewPart<WorkbookStylesPart>();
      }

      DifferentialFormats differentialFormats = new DifferentialFormats { Count = 1 };
      differentialFormats.AppendChild(new DifferentialFormat
      {
        Fill = new Fill
        {
          PatternFill = new PatternFill
          {
            PatternType = new EnumValue<PatternValues>(PatternValues.Solid),
            BackgroundColor = new BackgroundColor { Rgb = "FFFF0000" }
          }
        }
      });
      Fonts fonts = new Fonts { Count = 1 };
      fonts.AppendChild(new Font
      {
        Bold = new Bold(),
        FontSize = new FontSize { Val = 12.0 },
        Color = new Color { Theme = 1 },
        FontName = new FontName { Val = "微软雅黑" },
        FontCharSet = new FontCharSet { Val = 134 }
      });
      Borders borders = new Borders { Count = 2 };
      borders.AppendChild(new Border
      {
        LeftBorder = new LeftBorder(),
        RightBorder = new RightBorder(),
        TopBorder = new TopBorder(),
        BottomBorder = new BottomBorder(),
        DiagonalBorder = new DiagonalBorder()
      });
      borders.AppendChild(new Border
      {
        LeftBorder = new LeftBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        RightBorder = new RightBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Dashed), Color = new Color { Rgb = "FFFF0000" } },
        TopBorder = new TopBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        BottomBorder = new BottomBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Auto = true } },
        // DiagonalBorder = new DiagonalBorder()
      });
      Fills fills = new Fills { Count = 2 };
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill { PatternType = new EnumValue<PatternValues>(PatternValues.None) }
      });
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill { PatternType = new EnumValue<PatternValues>(PatternValues.Gray125) }
      });
      fills.AppendChild(new Fill
      {
        PatternFill = new PatternFill
        {
          PatternType = new EnumValue<PatternValues>(PatternValues.Solid),
          ForegroundColor = new ForegroundColor { Rgb = "FFFFFF00" },
        }
      });

      CellStyleFormats cellStyleFormats = new CellStyleFormats { Count = 1 };
      cellStyleFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 1, BorderId = 0 });

      CellFormats cellFormats = new CellFormats { Count = 2 };
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0 });
      cellFormats.AppendChild(new CellFormat
      {
        NumberFormatId = 0,
        FontId = 0,
        FillId = 2,
        BorderId = 1,
        FormatId = 0,
        Alignment = new Alignment
        {
          Horizontal = new EnumValue<HorizontalAlignmentValues>(HorizontalAlignmentValues.Center),
          Vertical = new EnumValue<VerticalAlignmentValues>(VerticalAlignmentValues.Center)
        },
        ApplyFont = true,
        ApplyFill = false,
        ApplyBorder = true,
        ApplyAlignment = true
      });

      // CellStyles cellStyles = new CellStyles { Count = 1 };
      // cellStyles.AppendChild(new CellStyle { Name = "Normal", FormatId = 0, BuiltinId = 0 });

      Stylesheet stylesheet = new Stylesheet
      {
        Fonts = fonts,
        Borders = borders,
        Fills = fills,
        CellStyleFormats = cellStyleFormats,
        CellFormats = cellFormats,
        // CellStyles = cellStyles,
        DifferentialFormats = differentialFormats
      };

      workbookStylesPart.Stylesheet = stylesheet;


      row.AppendChild(new Cell
      {
        CellReference = "A1",
        CellValue = new CellValue(InsertSharedStringItem("ABCD", shareStringPart).ToString()),
        DataType = new EnumValue<CellValues>(CellValues.SharedString),
        StyleIndex = 1
      });
      // row.AppendChild(new Cell { CellReference = "B1", CellValue = new CellValue(100000), DataType = new EnumValue<CellValues>(CellValues.Number) });
      // row.AppendChild(new Cell { CellReference = "B2", CellValue = new CellValue(200000), DataType = new EnumValue<CellValues>(CellValues.Number) });
      // row.AppendChild(new Cell { CellReference = "B3", CellFormula = new CellFormula("SUM(B1:B2)") });

      // AutoFilter autoFilter = new AutoFilter { Reference = "A1:B3" };
      // CustomFilters customFilters = new CustomFilters();
      // customFilters.AppendChild(new CustomFilter { Operator = new EnumValue<FilterOperatorValues>(FilterOperatorValues.GreaterThanOrEqual), Val = "300000" });
      // autoFilter.AppendChild(new FilterColumn { ColumnId = 1, CustomFilters = customFilters });

      // worksheetPart.Worksheet.AppendChild(autoFilter);
      // MergeTwoCells(worksheetPart.Worksheet, "A2", "C2");

      // StringValue[] srf = { "B1:B3" };
      // ConditionalFormatting cf = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf) };

      // var cfRule = new ConditionalFormattingRule
      // {
      //   Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
      //   FormatId = 0,
      //   Priority = 1,
      //   Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThanOrEqual)
      // };
      // cfRule.AppendChild(new Formula("200000"));
      // cf.AppendChild(cfRule);

      // worksheetPart.Worksheet.AppendChild(cf);


      workbookpart.Workbook.Save();

      // Close the document.
      spreadsheetDocument.Close();
    }

    public static void q()
    {
      int[] scores = { 81, 72, 93 };
      var highScoresQuery =
        from score in scores
        where score > 80
        orderby score descending
        select $"{score}, ";

      foreach (var score in highScoresQuery)
      {
        Console.Write(score);
      }
    }

    static async Task Main(string[] args)
    {
      Console.WriteLine("start");

      // var records1 = await ExcelData.GetRecords1Async();

      // var records1Query = from record1 in records1
      //                     select $"city: {record1.City}, per: {record1.Person}";
      // foreach (var rec1 in records1Query)
      // {
      //   Console.WriteLine(rec1);
      // }
      await ExcelBuilder.BuildTable2();
      // var server = new WebServer(20);
      // server.Bind("http://192.168.3.3:9040/");
      // server.Start();
      // Console.WriteLine("running");
      // Console.ReadKey();

      // Console.WriteLine(ExcelBuilder.toColName(52));

      // var num = 6 - 1;
      // Console.WriteLine(ExcelBuilder.toColName(num));
      // CreateSpreadsheetWorkbook(@"D:\G\d\test.xlsx");
      // q();
      // new GeneratedClass().CreatePackage(@"D:\G\d\gen.xlsx");
    }
  }
}
