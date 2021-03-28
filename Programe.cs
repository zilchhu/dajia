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

  public class Record3
  {
    public string City { get; set; }
    public string Person { get; set; }
    public string Real_Shop { get; set; }
    public double? Income_Sum_Month { get; set; }
    public double? Cost_Sum_Month { get; set; }
    public double? Cost_Sum_Ratio_Month { get; set; }
    public double? Consume_Sum_Month { get; set; }
    public double? Consume_Sum_Ratio_Month { get; set; }
    public double? Rent_Cost_Month { get; set; }
    public double? Labor_Cost_Month { get; set; }
    public double? Water_Electr_Cost_Month { get; set; }
    public double? Cashback_Cost_Month { get; set; }
    public double? Oper_Cost_Month { get; set; }
    public double? Profit_Month { get; set; }
    public string Ym { get; set; }
  }

  public class Record4
  {
    public string City { get; set; }
    public string Person { get; set; }
    public string Real_Shop { get; set; }
    public double? Income_Sum { get; set; }
    public double? Cost_Sum { get; set; }
    public double? Cost_Sum_Ratio { get; set; }
    public double? Consume_Sum { get; set; }
    public double? Consume_Sum_Ratio { get; set; }
    public double? Rent_Cost { get; set; }
    public double? Labor_Cost { get; set; }
    public double? Water_Electr_Cost { get; set; }
    public double? Cashback_Cost { get; set; }
    public double? Oper_Cost { get; set; }
    public double? Profit { get; set; }
    public string Date { get; set; }
  }

  public class Record5
  {
    public string New_Person { get; set; }
    public string WmPoiId { get; set; }
    public string Name { get; set; }
    public string Platform { get; set; }
    public double? Evaluate { get; set; }
    public double? Order { get; set; }
    public double? BizScore { get; set; }
    public double? Moment { get; set; }
    public double? Turnover { get; set; }
    public double? UnitPrice { get; set; }
    public double? Overview { get; set; }
    public double? Entryrate { get; set; }
    public double? Orderrate { get; set; }
    public double? Specific_Rate { get; set; }
    public double? Off_Shelf { get; set; }
    public double? Over_Due_Date { get; set; }
    public double? Red_Packet_Recharge { get; set; }
    public double? Ranknum { get; set; }
    public double? Bad_Order { get; set; }
    public double? Extend { get; set; }
    public double? Income { get; set; }
    public double? Cost_Ratio { get; set; }
    public string Kangaroo_Name { get; set; }
    public string A2 { get; set; }
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

    public static async Task<Record3[]> GetRecords3Async()
    {
      var records3 = new Record3[0];
      try
      {
        records3 = await client.GetFromJsonAsync<Record3[]>("export/op2");
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
      return records3;
    }

    public static async Task<Record4[]> GetRecords4Async()
    {
      var records4 = new Record4[0];
      try
      {
        records4 = await client.GetFromJsonAsync<Record4[]>("export/op3");
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
      return records4;
    }

    public static async Task<Record5[]> GetRecords5Async()
    {
      var records5 = new Record5[0];
      try
      {
        records5 = await client.GetFromJsonAsync<Record5[]>("export/fresh");
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
      return records5;
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
          v?.Income_Sum != null ? new NumberItem { Val = v.Income_Sum } : new MissingItem(),
          v?.Income_Avg != null ? new NumberItem { Val = v.Income_Avg } : new MissingItem(),
          v?.Income_Score != null ? new NumberItem { Val = v.Income_Score } : new MissingItem(),
          v?.Cost_Sum != null ? new NumberItem { Val = v.Cost_Sum } : new MissingItem(),
          v?.Cost_Avg != null ? new NumberItem { Val = v.Cost_Avg } : new MissingItem(),
          v?.Cost_Sum_Ratio != null ? new NumberItem { Val = v.Cost_Sum_Ratio } : new MissingItem(),
          v?.Cost_Score != null ? new NumberItem { Val = v.Cost_Score } : new MissingItem(),
          v?.Consume_Sum != null ? new NumberItem { Val = v.Consume_Sum } : new MissingItem(),
          v?.Consume_Avg != null ? new NumberItem { Val = v.Consume_Avg } : new MissingItem(),
          v?.Consume_Sum_Ratio != null ? new NumberItem { Val = v.Consume_Sum_Ratio } : new MissingItem(),
          v?.Consume_Score != null ? new NumberItem { Val = v.Consume_Score } : new MissingItem(),
          v?.Score != null ? new NumberItem { Val = v.Score } : new MissingItem(),
          v?.Score_1 != null ? new NumberItem { Val = v.Score_1 } : new MissingItem(),
          v?.Score_Avg != null ? new NumberItem { Val = v.Score_Avg } : new MissingItem(),
          v?.Score_Avg_1 != null ? new NumberItem { Val = v.Score_Avg_1 } : new MissingItem(),
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
      var data2 = await ExcelData.GetRecords3Async();
      var data3 = await ExcelData.GetRecords4Async();
      var colLen = 27;
      var colLen2 = data2.Select(v => v.Ym).Distinct().Count() * 11 + 3;
      var colLen3 = data3.Select(v => v.Date).Distinct().Count() * 11 + 3;
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
        LeftBorder = new LeftBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Rgb = "FF0000FF" } },
        RightBorder = new RightBorder(),
        TopBorder = new TopBorder(),
        BottomBorder = new BottomBorder()
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

      CellFormats cellFormats = new CellFormats { Count = 4 };
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0 });
      cellFormats.AppendChild(new CellFormat
      {
        NumberFormatId = 0,
        FontId = 0,
        FillId = 2,
        BorderId = 0,
        FormatId = 0,
        Alignment = new Alignment
        {
          Horizontal = new EnumValue<HorizontalAlignmentValues>(HorizontalAlignmentValues.Center),
          Vertical = new EnumValue<VerticalAlignmentValues>(VerticalAlignmentValues.Center)
        },
        ApplyFont = false,
        ApplyFill = true,
        ApplyBorder = false,
        ApplyAlignment = true
      });
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 10, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0, ApplyNumberFormat = true });
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 1, FormatId = 0, ApplyBorder = true });
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
        Pane = new Pane { HorizontalSplit = 6, VerticalSplit = 1, State = PaneStateValues.Frozen, TopLeftCell = "G2", ActivePane = PaneValues.BottomRight }
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
        Priority = 4
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
          v?.Third_Send != null ? new NumberItem { Val = v?.Third_Send } : new MissingItem(),
          v?.Unit_Price != null ? new NumberItem { Val = v?.Unit_Price } : new MissingItem(),
          v?.Orders != null ? new NumberItem { Val = v?.Orders } : new MissingItem(),
          v?.Income != null ? new NumberItem { Val = v?.Income } : new MissingItem(),
          v?.Income_Avg != null ? new NumberItem { Val = v?.Income_Avg } : new MissingItem(),
          v?.Income_Sum != null ? new NumberItem { Val = v?.Income_Sum } : new MissingItem(),
          v?.Cost != null ? new NumberItem { Val = v?.Cost } : new MissingItem(),
          v?.Cost_Avg != null ? new NumberItem { Val = v?.Cost_Avg } : new MissingItem(),
          v?.Cost_Sum != null ? new NumberItem { Val = v?.Cost_Sum } : new MissingItem(),
          v?.Cost_Ratio != null ? new NumberItem { Val = v?.Cost_Ratio } : new MissingItem(),
          v?.Cost_Sum_Ratio != null ? new NumberItem { Val = v?.Cost_Sum_Ratio } : new MissingItem(),
          v?.Consume != null ? new NumberItem { Val = v?.Consume } : new MissingItem(),
          v?.Consume_Avg != null ? new NumberItem { Val = v?.Consume_Avg } : new MissingItem(),
          v?.Consume_Sum != null ? new NumberItem { Val = v?.Consume_Sum } : new MissingItem(),
          v?.Consume_Ratio != null ? new NumberItem { Val = v?.Consume_Ratio } : new MissingItem(),
          v?.Consume_Sum_Ratio != null ? new NumberItem { Val = v?.Consume_Sum_Ratio } : new MissingItem(),
          v?.Settlea_30 != null ? new NumberItem { Val = v?.Settlea_30 } : new MissingItem(),
          v?.Settlea_1 != null ? new NumberItem { Val = v?.Settlea_1 } : new MissingItem(),
          v?.Settlea_7 != null ? new NumberItem { Val = v?.Settlea_7 } : new MissingItem(),
          v?.Settlea_7_3 != null ? new NumberItem { Val = v?.Settlea_7_3 } : new MissingItem(),
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


      // sheet5 sum_month
      var sheetPart5 = workbookPart.AddNewPart<WorksheetPart>("r5");
      var sheetViews5 = new SheetViews();
      sheetViews5.Append(new SheetView
      {
        WorkbookViewId = 0,
        Pane = new Pane { HorizontalSplit = 3, VerticalSplit = 2, State = PaneStateValues.Frozen, TopLeftCell = "D3", ActivePane = PaneValues.BottomRight }
      });
      var sheet5 = new Worksheet
      {
        SheetDimension = new SheetDimension { Reference = $"A1:{toColName(colLen2)}{data2.Length + 1}" },
        SheetViews = sheetViews5
      };
      sheetPart5.Worksheet = sheet5;

      var yms = data2.Select(v => v.Ym).Distinct().Select((v, i) => new { Val = v, Index = i });
      var realShops5 = data2.Select(v => v.Real_Shop).Distinct().Select((v, i) => new { Val = v, Index = i });
      var sheetData5 = new SheetData();
      var headerRow5 = new Row { RowIndex = 1, StyleIndex = 1, CustomFormat = true };
      var headerRow52 = new Row { RowIndex = 2, StyleIndex = 1, CustomFormat = true };
      var mergeCells = new MergeCells { Count = (uint)yms.Count() };

      var hA = CreateStringCell("A2", "城市", sstPart);
      hA.StyleIndex = 1;
      var hB = CreateStringCell("B2", "负责人", sstPart);
      hB.StyleIndex = 1;
      var hC = CreateStringCell("C2", "物理店", sstPart);
      hC.StyleIndex = 1;
      headerRow52.Append(
        hA, hB, hC
      );
      foreach (var ym in yms)
      {
        var cell = CreateStringCell($"{toColName(ym.Index * 11 + 4)}1", ym.Val, sstPart);
        cell.StyleIndex = 1;
        headerRow5.Append(cell);
        var colD = CreateStringCell($"{toColName(ym.Index * 11 + 4)}2", "营业收入", sstPart);
        colD.StyleIndex = 1;
        var colE = CreateStringCell($"{toColName(ym.Index * 11 + 5)}2", "推广费用", sstPart);
        colE.StyleIndex = 1;
        var colF = CreateStringCell($"{toColName(ym.Index * 11 + 6)}2", "推广比例", sstPart);
        colF.StyleIndex = 1;
        var colG = CreateStringCell($"{toColName(ym.Index * 11 + 7)}2", "成本", sstPart);
        colG.StyleIndex = 1;
        var colH = CreateStringCell($"{toColName(ym.Index * 11 + 8)}2", "成本比例", sstPart);
        colH.StyleIndex = 1;
        var colI = CreateStringCell($"{toColName(ym.Index * 11 + 9)}2", "房租成本", sstPart);
        colI.StyleIndex = 1;
        var colJ = CreateStringCell($"{toColName(ym.Index * 11 + 10)}2", "人工成本", sstPart);
        colJ.StyleIndex = 1;
        var colK = CreateStringCell($"{toColName(ym.Index * 11 + 11)}2", "水电成本", sstPart);
        colK.StyleIndex = 1;
        var colL = CreateStringCell($"{toColName(ym.Index * 11 + 12)}2", "好评返现", sstPart);
        colL.StyleIndex = 1;
        var colM = CreateStringCell($"{toColName(ym.Index * 11 + 13)}2", "运营成本", sstPart);
        colM.StyleIndex = 1;
        var colN = CreateStringCell($"{toColName(ym.Index * 11 + 14)}2", "利润", sstPart);
        colN.StyleIndex = 1;
        headerRow52.Append(
          colD, colE, colF, colG, colH, colI, colJ, colK, colL, colM, colN
        );
        mergeCells.Append(new MergeCell { Reference = $"{toColName(ym.Index * 11 + 4)}1:${toColName(ym.Index * 11 + 14)}1" });
      }
      sheetData5.Append(headerRow5, headerRow52);

      foreach (var realShop in realShops5)
      {
        var i = (uint)realShop.Index + 3;
        var row = new Row { RowIndex = i };
        var colA = CreateStringCell($"A{i}", data2.FirstOrDefault(v => v.Real_Shop == realShop.Val)?.City, sstPart);
        var colB = CreateStringCell($"B{i}", data2.FirstOrDefault(v => v.Real_Shop == realShop.Val)?.Person, sstPart);
        var colC = CreateStringCell($"C{i}", realShop.Val, sstPart);

        row.Append(colA, colB, colC);
        foreach (var ym in yms)
        {
          var v = data2.FirstOrDefault(v => v.Real_Shop == realShop.Val && v.Ym == ym.Val);
          row.Append(
            v?.Income_Sum_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 4)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Sum_Month), StyleIndex = 3 } : null,
            v?.Consume_Sum_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 5)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum_Month) } : null,
            v?.Consume_Sum_Ratio_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 6)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum_Ratio_Month), StyleIndex = 2 } : null,
            v?.Cost_Sum_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 7)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum_Month) } : null,
            v?.Cost_Sum_Ratio_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 8)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum_Ratio_Month), StyleIndex = 2 } : null,
            v?.Rent_Cost_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 9)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Rent_Cost_Month) } : null,
            v?.Labor_Cost_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 10)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Labor_Cost_Month) } : null,
            v?.Water_Electr_Cost_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 11)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Water_Electr_Cost_Month) } : null,
            v?.Cashback_Cost_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 12)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cashback_Cost_Month) } : null,
            v?.Oper_Cost_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 13)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Oper_Cost_Month) } : null,
            v?.Profit_Month != null ? new Cell { CellReference = $"{toColName(ym.Index * 11 + 14)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Profit_Month) } : null
          );
        }
        sheetData5.Append(row);
      }

      var bottomRow = new Row { RowIndex = (uint)realShops5.Count() + 3 };
      var bA = CreateStringCell($"A{realShops5.Count() + 3}", "总计", sstPart);
      bA.StyleIndex = 1;
      bottomRow.Append(bA);
      mergeCells.Append(new MergeCell { Reference = $"A{realShops5.Count() + 3}:C{realShops5.Count() + 3}" });
      foreach (var ym in yms)
      {
        var j = toColName(ym.Index * 11 + 4);
        var j2 = toColName(ym.Index * 11 + 5);
        var j3 = toColName(ym.Index * 11 + 6);
        var j4 = toColName(ym.Index * 11 + 7);
        var j5 = toColName(ym.Index * 11 + 8);
        var j6 = toColName(ym.Index * 11 + 9);
        var j7 = toColName(ym.Index * 11 + 10);
        var j8 = toColName(ym.Index * 11 + 11);
        var j9 = toColName(ym.Index * 11 + 12);
        var j10 = toColName(ym.Index * 11 + 13);
        var j11 = toColName(ym.Index * 11 + 14);
        bottomRow.Append(
          new Cell { CellReference = $"{j}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j}3:${j}{realShops5.Count() + 2})"), StyleIndex = 3 },
          new Cell { CellReference = $"{j2}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j2}3:${j2}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j3}{realShops5.Count() + 3}", CellFormula = new CellFormula($"{j2}{realShops5.Count() + 3}/{j}{realShops5.Count() + 3}"), StyleIndex = 2 },
          new Cell { CellReference = $"{j4}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j4}3:${j4}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j5}{realShops5.Count() + 3}", CellFormula = new CellFormula($"{j4}{realShops5.Count() + 3}/{j}{realShops5.Count() + 3}"), StyleIndex = 2 },
          new Cell { CellReference = $"{j6}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j6}3:${j6}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j7}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j7}3:${j7}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j8}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j8}3:${j8}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j9}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j9}3:${j9}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j10}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j10}3:${j10}{realShops5.Count() + 2})") },
          new Cell { CellReference = $"{j11}{realShops5.Count() + 3}", CellFormula = new CellFormula($"SUM({j11}3:${j11}{realShops5.Count() + 2})") }
        );
      }
      sheetData5.Append(bottomRow);
      sheet5.Append(sheetData5, mergeCells);

      foreach (var ym in yms)
      {
        StringValue[] srf_5 = { $"{toColName(ym.Index * 11 + 8)}3:{toColName(ym.Index * 11 + 8)}{realShops.Count() + 3}" };
        var cf_5 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf_5) };
        var cfRule_5 = new ConditionalFormattingRule
        {
          Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
          FormatId = 0,
          Priority = ym.Index * 2 + 5,
          Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
        };
        cfRule_5.AppendChild(new Formula("0.5"));
        cf_5.AppendChild(cfRule_5);

        StringValue[] srf2_5 = { $"{toColName(ym.Index * 11 + 6)}3:{toColName(ym.Index * 11 + 6)}{realShops.Count() + 3}" };
        var cf2_5 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf2_5) };
        var cfRule2_5 = new ConditionalFormattingRule
        {
          Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
          FormatId = 0,
          Priority = ym.Index * 2 + 6,
          Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
        };
        cfRule2_5.AppendChild(new Formula("0.045"));
        cf2_5.AppendChild(cfRule2_5);
        sheet5.Append(cf2_5, cf_5);
      }


      // sheet6
      var sheetPart6 = workbookPart.AddNewPart<WorksheetPart>("r66");
      var sheetViews6 = new SheetViews();
      sheetViews6.Append(new SheetView
      {
        WorkbookViewId = 0,
        Pane = new Pane { HorizontalSplit = 3, VerticalSplit = 2, State = PaneStateValues.Frozen, TopLeftCell = "D3", ActivePane = PaneValues.TopRight }
      });
      var sheet6 = new Worksheet
      {
        SheetDimension = new SheetDimension { Reference = $"A1:{toColName(colLen3)}{data3.Length + 1}" },
        SheetViews = sheetViews6
      };
      sheetPart6.Worksheet = sheet6;

      var dates6 = data3.Select(v => v.Date).Distinct().Select((v, i) => new { Val = v, Index = i });
      var realShops6 = data3.Select(v => v.Real_Shop).Distinct().Select((v, i) => new { Val = v, Index = i });
      var sheetData6 = new SheetData();
      var headerRow6 = new Row { RowIndex = 1, StyleIndex = 1, CustomFormat = true };
      var headerRow62 = new Row { RowIndex = 2, StyleIndex = 1, CustomFormat = true };
      var mergeCells6 = new MergeCells { Count = (uint)yms.Count() };

      var hA6 = CreateStringCell("A2", "城市", sstPart);
      hA6.StyleIndex = 1;
      var hB6 = CreateStringCell("B2", "负责人", sstPart);
      hB6.StyleIndex = 1;
      var hC6 = CreateStringCell("C2", "物理店", sstPart);
      hC6.StyleIndex = 1;
      headerRow62.Append(
        hA6, hB6, hC6
      );
      foreach (var date in dates6)
      {
        var cell = CreateStringCell($"{toColName(date.Index * 11 + 4)}1", date.Val, sstPart);
        cell.StyleIndex = 1;
        headerRow6.Append(cell);
        var colD = CreateStringCell($"{toColName(date.Index * 11 + 4)}2", "营业收入", sstPart);
        colD.StyleIndex = 1;
        var colE = CreateStringCell($"{toColName(date.Index * 11 + 5)}2", "推广费用", sstPart);
        colE.StyleIndex = 1;
        var colF = CreateStringCell($"{toColName(date.Index * 11 + 6)}2", "推广比例", sstPart);
        colF.StyleIndex = 1;
        var colG = CreateStringCell($"{toColName(date.Index * 11 + 7)}2", "成本", sstPart);
        colG.StyleIndex = 1;
        var colH = CreateStringCell($"{toColName(date.Index * 11 + 8)}2", "成本比例", sstPart);
        colH.StyleIndex = 1;
        var colI = CreateStringCell($"{toColName(date.Index * 11 + 9)}2", "房租成本", sstPart);
        colI.StyleIndex = 1;
        var colJ = CreateStringCell($"{toColName(date.Index * 11 + 10)}2", "人工成本", sstPart);
        colJ.StyleIndex = 1;
        var colK = CreateStringCell($"{toColName(date.Index * 11 + 11)}2", "水电成本", sstPart);
        colK.StyleIndex = 1;
        var colL = CreateStringCell($"{toColName(date.Index * 11 + 12)}2", "好评返现", sstPart);
        colL.StyleIndex = 1;
        var colM = CreateStringCell($"{toColName(date.Index * 11 + 13)}2", "运营成本", sstPart);
        colM.StyleIndex = 1;
        var colN = CreateStringCell($"{toColName(date.Index * 11 + 14)}2", "利润", sstPart);
        colN.StyleIndex = 1;
        headerRow62.Append(
          colD, colE, colF, colG, colH, colI, colJ, colK, colL, colM, colN
        );
        mergeCells6.Append(new MergeCell { Reference = $"{toColName(date.Index * 11 + 4)}1:${toColName(date.Index * 11 + 14)}1" });
      }
      sheetData6.Append(headerRow6, headerRow62);

      foreach (var realShop in realShops6)
      {
        var i = (uint)realShop.Index + 3;
        var row = new Row { RowIndex = i };
        var colA = CreateStringCell($"A{i}", data3.FirstOrDefault(v => v.Real_Shop == realShop.Val)?.City, sstPart);
        var colB = CreateStringCell($"B{i}", data3.FirstOrDefault(v => v.Real_Shop == realShop.Val)?.Person, sstPart);
        var colC = CreateStringCell($"C{i}", realShop.Val, sstPart);

        row.Append(colA, colB, colC);
        foreach (var date in dates6)
        {
          var v = data3.FirstOrDefault(v => v.Real_Shop == realShop.Val && v.Date == date.Val);
          row.Append(
            v?.Income_Sum != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 4)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income_Sum), StyleIndex = 3 } : null,
            v?.Consume_Sum != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 5)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum) } : null,
            v?.Consume_Sum_Ratio != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 6)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Consume_Sum_Ratio), StyleIndex = 2 } : null,
            v?.Cost_Sum != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 7)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum) } : null,
            v?.Cost_Sum_Ratio != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 8)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Sum_Ratio), StyleIndex = 2 } : null,
            v?.Rent_Cost != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 9)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Rent_Cost) } : null,
            v?.Labor_Cost != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 10)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Labor_Cost) } : null,
            v?.Water_Electr_Cost != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 11)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Water_Electr_Cost) } : null,
            v?.Cashback_Cost != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 12)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cashback_Cost) } : null,
            v?.Oper_Cost != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 13)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Oper_Cost) } : null,
            v?.Profit != null ? new Cell { CellReference = $"{toColName(date.Index * 11 + 14)}{i}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Profit) } : null
          );
        }
        sheetData6.Append(row);
      }

      var bottomRow6 = new Row { RowIndex = (uint)realShops6.Count() + 3 };
      var bA6 = CreateStringCell($"A{realShops6.Count() + 3}", "总计", sstPart);
      bA6.StyleIndex = 1;
      bottomRow6.Append(bA6);
      mergeCells6.Append(new MergeCell { Reference = $"A{realShops6.Count() + 3}:C{realShops6.Count() + 3}" });
      foreach (var date in dates6)
      {
        var j = toColName(date.Index * 11 + 4);
        var j2 = toColName(date.Index * 11 + 5);
        var j3 = toColName(date.Index * 11 + 6);
        var j4 = toColName(date.Index * 11 + 7);
        var j5 = toColName(date.Index * 11 + 8);
        var j6 = toColName(date.Index * 11 + 9);
        var j7 = toColName(date.Index * 11 + 10);
        var j8 = toColName(date.Index * 11 + 11);
        var j9 = toColName(date.Index * 11 + 12);
        var j10 = toColName(date.Index * 11 + 13);
        var j11 = toColName(date.Index * 11 + 14);
        bottomRow6.Append(
          new Cell { CellReference = $"{j}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j}3:${j}{realShops6.Count() + 2})"), StyleIndex = 3 },
          new Cell { CellReference = $"{j2}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j2}3:${j2}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j3}{realShops6.Count() + 3}", CellFormula = new CellFormula($"{j2}{realShops6.Count() + 3}/{j}{realShops6.Count() + 3}"), StyleIndex = 2 },
          new Cell { CellReference = $"{j4}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j4}3:${j4}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j5}{realShops6.Count() + 3}", CellFormula = new CellFormula($"{j4}{realShops6.Count() + 3}/{j}{realShops6.Count() + 3}"), StyleIndex = 2 },
          new Cell { CellReference = $"{j6}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j6}3:${j6}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j7}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j7}3:${j7}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j8}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j8}3:${j8}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j9}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j9}3:${j9}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j10}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j10}3:${j10}{realShops6.Count() + 2})") },
          new Cell { CellReference = $"{j11}{realShops6.Count() + 3}", CellFormula = new CellFormula($"SUM({j11}3:${j11}{realShops6.Count() + 2})") }
        );
      }
      sheetData6.Append(bottomRow6);
      sheet6.Append(sheetData6);
      sheet6.Append(mergeCells6);

      foreach (var date in dates6)
      {
        StringValue[] srf_6 = { $"{toColName(date.Index * 11 + 8)}3:{toColName(date.Index * 11 + 8)}{realShops.Count() + 3}" };
        var cf_6 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf_6) };
        var cfRule_6 = new ConditionalFormattingRule
        {
          Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
          FormatId = 0,
          Priority = date.Index * 2 + 5,
          Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
        };
        cfRule_6.AppendChild(new Formula("0.5"));
        cf_6.AppendChild(cfRule_6);

        StringValue[] srf2_6 = { $"{toColName(date.Index * 11 + 6)}3:{toColName(date.Index * 11 + 6)}{realShops.Count() + 3}" };
        var cf2_6 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf2_6) };
        var cfRule2_6 = new ConditionalFormattingRule
        {
          Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
          FormatId = 0,
          Priority = date.Index * 2 + 6,
          Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
        };
        cfRule2_6.AppendChild(new Formula("0.045"));
        cf2_6.AppendChild(cfRule2_6);
        sheet6.Append(cf2_6, cf_6);
      }


      var sheets = new Sheets();
      sheets.Append(
        new Sheet { Id = "r1", Name = "sheet1", SheetId = 1 },
        new Sheet { Id = "r2", Name = "收入汇总", SheetId = 2 },
        new Sheet { Id = "r33", Name = "成本汇总", SheetId = 3 },
        new Sheet { Id = "r4", Name = "推广汇总", SheetId = 4 },
        new Sheet { Id = "r5", Name = "总计(月)", SheetId = 5 },
        new Sheet { Id = "r66", Name = "总计(日)", SheetId = 6 }
      );

      var pivotCaches = new PivotCaches();
      pivotCaches.Append(new PivotCache { CacheId = 1, Id = "r3" });
      workbookPart.Workbook = new Workbook { Sheets = sheets, PivotCaches = pivotCaches };

      doc.Save();
      doc.Close();
    }

    public static async Task BuildTable3()
    {
      var data = await ExcelData.GetRecords5Async();

      var colLen = data.Select(v => v.Date).Distinct().Count() + 5;
      var rowLen = data.Select(v => v.WmPoiId).Distinct().Count() * 19 + 1;
      var yesterday = DateTime.Today.AddDays(-1).ToString("yyyyMMdd");

      var doc = SpreadsheetDocument.Create(@$"D:\G\d\files\新店表{yesterday}.xlsx", SpreadsheetDocumentType.Workbook);
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
        LeftBorder = new LeftBorder { Style = new EnumValue<BorderStyleValues>(BorderStyleValues.Thin), Color = new Color { Rgb = "FF0000FF" } },
        RightBorder = new RightBorder(),
        TopBorder = new TopBorder(),
        BottomBorder = new BottomBorder()
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

      CellFormats cellFormats = new CellFormats { Count = 4 };
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0 });
      cellFormats.AppendChild(new CellFormat
      {
        NumberFormatId = 0,
        FontId = 0,
        FillId = 2,
        BorderId = 0,
        FormatId = 0,
        Alignment = new Alignment
        {
          Horizontal = new EnumValue<HorizontalAlignmentValues>(HorizontalAlignmentValues.Center),
          Vertical = new EnumValue<VerticalAlignmentValues>(VerticalAlignmentValues.Center)
        },
        ApplyFont = false,
        ApplyFill = true,
        ApplyBorder = false,
        ApplyAlignment = true
      });
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 10, FontId = 0, FillId = 0, BorderId = 0, FormatId = 0, ApplyNumberFormat = true });
      cellFormats.AppendChild(new CellFormat { NumberFormatId = 0, FontId = 0, FillId = 0, BorderId = 1, FormatId = 0, ApplyBorder = true });
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


      // sheet5 sum_month
      var sheetPart = workbookPart.AddNewPart<WorksheetPart>("r1");
      var sheetViews = new SheetViews();
      sheetViews.Append(new SheetView
      {
        WorkbookViewId = 0,
        Pane = new Pane { HorizontalSplit = 5, VerticalSplit = 1, State = PaneStateValues.Frozen, TopLeftCell = "F2", ActivePane = PaneValues.BottomRight }
      });
      var sheet = new Worksheet
      {
        SheetDimension = new SheetDimension { Reference = $"A1:{toColName(colLen)}{rowLen}" },
        SheetViews = sheetViews
      };
      sheetPart.Worksheet = sheet;

      var dates = data.Select(v => v.Date).Distinct().Select((v, i) => new { Val = v, Index = i });
      var shopIds = data.Select(v => v.WmPoiId).Distinct().Select((v, i) => new { Val = v, Index = i });
      var sheetData = new SheetData();
      var headerRow = new Row { RowIndex = 1, StyleIndex = 1, CustomFormat = true };
      var mergeCells = new MergeCells { Count = (uint)shopIds.Count() * 4 };

      var hA = CreateStringCell("A1", "负责人", sstPart);
      hA.StyleIndex = 1;
      var hB = CreateStringCell("B1", "门店ID", sstPart);
      hB.StyleIndex = 1;
      var hC = CreateStringCell("C1", "门店", sstPart);
      hC.StyleIndex = 1;
      var hD = CreateStringCell("D1", "平台", sstPart);
      hD.StyleIndex = 1;
      var hE = CreateStringCell("E1", "项目", sstPart);
      hE.StyleIndex = 1;
      headerRow.Append(
        hA, hB, hC, hD, hE
      );
      foreach (var date in dates)
      {
        var cell = CreateStringCell($"{toColName(date.Index + 4)}1", date.Val, sstPart);
        cell.StyleIndex = 1;
        headerRow.Append(cell);
      }
      sheetData.Append(headerRow);


      var fields = new Dictionary<int, string>();
      fields.Add(1, "评论数");
      fields.Add(2, "差评数");
      fields.Add(3, "单量");
      fields.Add(4, "评价率");
      fields.Add(5, "评分");
      fields.Add(6, "推广");
      fields.Add(7, "营业额");
      fields.Add(8, "客单价");
      fields.Add(9, "曝光量");
      fields.Add(10, "进店率");
      fields.Add(11, "下单率");
      fields.Add(12, "成本比例");
      fields.Add(13, "下架产品量");
      fields.Add(14, "特权有效期");
      fields.Add(15, "袋鼠店长");
      fields.Add(16, "高佣返现");
      fields.Add(17, "商圈排名");
      fields.Add(18, "延迟发单");
      fields.Add(19, "优化");

      foreach (var shopId in shopIds)
      {
        foreach(var i in Enumerable.Range(1, 19)) {
          var index = (uint)(shopId.Index * 19 + i + 1);
          var row = new Row { RowIndex =  index};
          var colA = CreateStringCell($"A{index}", data.FirstOrDefault(v => v.WmPoiId == shopId.Val)?.New_Person, sstPart);
          var colB = CreateStringCell($"B{index}", shopId.Val, sstPart);
          var colC = CreateStringCell($"C{index}", data.FirstOrDefault(v => v.WmPoiId == shopId.Val)?.Name, sstPart);
          var colD = CreateStringCell($"D{index}", data.FirstOrDefault(v => v.WmPoiId == shopId.Val)?.Platform, sstPart);
          var colE = CreateStringCell($"E{index}", fields[i], sstPart);

          row.Append(colA, colB, colC, colD, colE);

          foreach (var date in dates)
          {
            var v = data.FirstOrDefault(v => v.WmPoiId == shopId.Val && v.Date == date.Val);

            if(i == 1) row.Append(v?.Evaluate != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Evaluate) } : null);
            else if(i == 2) row.Append(v?.Bad_Order != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Bad_Order) } : null);
            else if(i == 3) row.Append(v?.Order != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Order) } : null);
            else if(i == 4) row.Append(v?.Evaluate != null && v?.Order != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", CellFormula = new CellFormula($"{toColName(date.Index + 6)}{index - 3}/{toColName(date.Index + 6)}{index - 1}") } : null);
            else if(i == 5) row.Append(v?.BizScore != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.BizScore) } : null);
            else if(i == 6) row.Append(v?.Moment != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Moment) } : null);
            else if(i == 7) row.Append(v?.Income != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Income) } : null);
            else if(i == 8) row.Append(v?.UnitPrice != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.UnitPrice) } : null);
            else if(i == 9) row.Append(v?.Overview != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Overview) } : null);
            else if(i == 10) row.Append(v?.Entryrate != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Entryrate) } : null);
            else if(i == 11) row.Append(v?.Orderrate != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Orderrate) } : null);
            else if(i == 12) row.Append(v?.Cost_Ratio != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Cost_Ratio) } : null);
            else if(i == 13) row.Append(v?.Off_Shelf != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Off_Shelf) } : null);
            else if(i == 14) row.Append(v?.Over_Due_Date != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Over_Due_Date) } : null);
            else if(i == 15) row.Append(CreateStringCell($"{toColName(date.Index + 6)}{index}", v?.Kangaroo_Name, sstPart));
            else if(i == 16) row.Append(v?.Red_Packet_Recharge != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Red_Packet_Recharge) } : null);
            else if(i == 17) row.Append(v?.Ranknum != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Ranknum) } : null);
            else if(i == 18) row.Append(v?.Extend != null ? new Cell { CellReference = $"{toColName(date.Index + 6)}{index}", DataType = CellValues.Number, CellValue = new CellValue((double)v?.Extend) } : null);
            else if(i == 19) row.Append(CreateStringCell($"{toColName(date.Index + 6)}{index}", v?.A2, sstPart));
          }
          sheetData.Append(row);
        }
        
        var si = (uint)(shopId.Index * 19 + 2);
        mergeCells.Append(
          new MergeCell { Reference = $"A{si}:$A{si + 18}" },
          new MergeCell { Reference = $"B{si}:$B{si + 18}" },
          new MergeCell { Reference = $"C{si}:$C{si + 18}" },
          new MergeCell { Reference = $"D{si}:$D{si + 18}" }
        );
        
      }

      sheet.Append(sheetData, mergeCells);

      // foreach (var ym in yms)
      // {
      //   StringValue[] srf_5 = { $"{toColName(ym.Index * 11 + 8)}3:{toColName(ym.Index * 11 + 8)}{realShops.Count() + 3}" };
      //   var cf_5 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf_5) };
      //   var cfRule_5 = new ConditionalFormattingRule
      //   {
      //     Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
      //     FormatId = 0,
      //     Priority = ym.Index * 2 + 5,
      //     Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
      //   };
      //   cfRule_5.AppendChild(new Formula("0.5"));
      //   cf_5.AppendChild(cfRule_5);

      //   StringValue[] srf2_5 = { $"{toColName(ym.Index * 11 + 6)}3:{toColName(ym.Index * 11 + 6)}{realShops.Count() + 3}" };
      //   var cf2_5 = new ConditionalFormatting { SequenceOfReferences = new ListValue<StringValue>(srf2_5) };
      //   var cfRule2_5 = new ConditionalFormattingRule
      //   {
      //     Type = new EnumValue<ConditionalFormatValues>(ConditionalFormatValues.CellIs),
      //     FormatId = 0,
      //     Priority = ym.Index * 2 + 6,
      //     Operator = new EnumValue<ConditionalFormattingOperatorValues>(ConditionalFormattingOperatorValues.GreaterThan)
      //   };
      //   cfRule2_5.AppendChild(new Formula("0.045"));
      //   cf2_5.AppendChild(cfRule2_5);
      //   sheet5.Append(cf2_5, cf_5);
      // }


      var sheets = new Sheets();
      sheets.Append(
        new Sheet { Id = "r1", Name = "sheet1", SheetId = 1 }
      );

      workbookPart.Workbook = new Workbook { Sheets = sheets };

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

      if (!File.Exists(filePath) && urlPath.Contains("营推表"))
      {
        await ExcelBuilder.BuildTable2();
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
      await ExcelBuilder.BuildTable3();

      var server = new WebServer(20);
      server.Bind("http://192.168.3.3:9040/");
      server.Start();
      Console.WriteLine("running");
      Console.ReadKey();

      // Console.WriteLine(ExcelBuilder.toColName(52));

      // var num = 6 - 1;
      // Console.WriteLine(ExcelBuilder.toColName(num));
      // CreateSpreadsheetWorkbook(@"D:\G\d\test.xlsx");
      // q();
      // new GeneratedClass().CreatePackage(@"D:\G\d\gen.xlsx");
    }
  }
}
