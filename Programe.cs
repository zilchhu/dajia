using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
    public string RealShop { get; set; }
    public string Platform { get; set; }
    public string Person { get; set; }
    public double Consume { get; set; }
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
        records1 = await client.GetFromJsonAsync<Record1[]>("ts");
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
      return records1;
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
      return AZ[num % 26].ToString();
    }


    public static async Task BuildTable1()
    {
      var data = await ExcelData.GetRecords1Async();
      var colLen = 6;

      var doc = SpreadsheetDocument.Create(@"D:\G\d\table1.xlsx", SpreadsheetDocumentType.Workbook);
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
        Pane = new Pane { HorizontalSplit = 4, State = PaneStateValues.Frozen, TopLeftCell = "E1", ActivePane = PaneValues.TopRight }
      });
      var sheet = new Worksheet
      {
        SheetDimension = new SheetDimension { Reference = $"A1:{toColName(colLen - 1)}{data.Length + 1}" },
        SheetViews = sheetViews
      };
      sheetPart.Worksheet = sheet;

      // shhet.xml  x:sheetData
      var sheetData = new SheetData();
      var headerRow = new Row { RowIndex = 1, StyleIndex = 1, CustomFormat = true };
      var A = CreateStringCell("A1", "city", sstPart);
      A.StyleIndex = 1;
      var B = CreateStringCell("B1", "realShop", sstPart);
      B.StyleIndex = 1;
      var C = CreateStringCell("C1", "platform", sstPart);
      C.StyleIndex = 1;
      var D = CreateStringCell("D1", "person", sstPart);
      D.StyleIndex = 1;
      var E = CreateStringCell("E1", "consume", sstPart);
      E.StyleIndex = 1;
      var F = CreateStringCell("F1", "date", sstPart);
      F.StyleIndex = 1;
      headerRow.Append(
        A, B, C, D, E, F
      );
      sheetData.Append(headerRow);
      uint dataIndex = 2;
      foreach (var v in data)
      {
        var row = new Row { RowIndex = dataIndex };
        row.Append(
          CreateStringCell($"A{dataIndex}", v.City, sstPart),
          CreateStringCell($"B{dataIndex}", v.RealShop, sstPart),
          CreateStringCell($"C{dataIndex}", v.Platform, sstPart),
          CreateStringCell($"D{dataIndex}", v.Person, sstPart),
          new Cell { CellReference = $"E{dataIndex}", DataType = CellValues.Number, CellValue = new CellValue(v.Consume) },
          CreateStringCell($"F{dataIndex}", v.Date, sstPart)
        );
        sheetData.Append(row);
        dataIndex++;
      }
      sheet.Append(sheetData);


      // pivot d
      var pcPart = workbookPart.AddNewPart<PivotTableCacheDefinitionPart>("r3");
      var cacheSource = new CacheSource { Type = SourceValues.Worksheet };
      cacheSource.Append(new WorksheetSource { Sheet = "sheet1", Reference = $"A1:{toColName(colLen - 1)}{data.Length + 1}" });

      var cacheFields = new CacheFields { Count = (uint)colLen };
      var realShops = data.Select(v => v.RealShop).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si2 = new SharedItems { Count = (uint)realShops.LongCount() };
      si2.Append(realShops.Select(v => new StringItem { Val = v.Val }));
      var platforms = data.Select(v => v.Platform).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si3 = new SharedItems { Count = (uint)platforms.LongCount() };
      si3.Append(platforms.Select(v => new StringItem { Val = v.Val }));
      var dates = data.Select(v => v.Date).Distinct().Select((v, i) => new { Val = v, Index = i });
      var si6 = new SharedItems { Count = (uint)dates.LongCount() };
      si6.Append(dates.Select(v => new StringItem { Val = v.Val }));
      cacheFields.Append(
        new CacheField { Name = "city", SharedItems = new SharedItems() },
        new CacheField { Name = "realShop", SharedItems = si2 },
        new CacheField { Name = "platform", SharedItems = si3 },
        new CacheField { Name = "person", SharedItems = new SharedItems() },
        new CacheField { Name = "consume", SharedItems = new SharedItems() },
        new CacheField { Name = "date", SharedItems = si6 }
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
          new StringItem { Val = v.City },
          new FieldItem { Val = (uint)realShops.First(k => k.Val == v.RealShop).Index },
          new FieldItem { Val = (uint)platforms.First(k => k.Val == v.Platform).Index },
          new StringItem { Val = v.Person },
          new NumberItem { Val = v.Consume },
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

      var pfs = new PivotFields { Count = 6 };

      var pf1 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      var items1 = new Items { Count = (uint)realShops.LongCount() + 1 };
      items1.Append(
        Enumerable.Range(0, (int)realShops.LongCount()).Select(v => new Item { Index = (uint)v })
      );
      items1.Append(new Item { ItemType = ItemValues.Default });
      pf1.Append(items1);
      var pf3 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      var items3 = new Items { Count = (uint)platforms.LongCount() + 1 };
      items3.Append(
        Enumerable.Range(0, (int)platforms.LongCount()).Select(v => new Item { Index = (uint)v })
      );
      items3.Append(new Item { ItemType = ItemValues.Default });
      pf3.Append(items3);
      var pf2 = new PivotField { Axis = PivotTableAxisValues.AxisColumn, SortType = FieldSortValues.Descending };
      var items2 = new Items { Count = (uint)dates.LongCount() + 1 };
      items2.Append(
        Enumerable.Range(0, (int)dates.LongCount()).Select(v => new Item { Index = (uint)v }).Reverse()
      );
      items2.Append(new Item { ItemType = ItemValues.Default });
      pf2.Append(items2);
      pfs.Append(
        new PivotField(),
        pf1,
        pf3,
        new PivotField(),
        new PivotField { DataField = true },
        pf2
      );
      var rfs = new RowFields { Count = 1 };
      rfs.Append(new Field { Index = 1 }, new Field { Index = 2 });
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
      cfs.Append(new Field { Index = 5 });
      var cis = new ColumnItems { Count = (uint)realShops.LongCount() + 1 };
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
      dfs.Append(new DataField { Name = "Sum of Consume", Field = 4 });
      var pt = new PivotTableDefinition
      {
        Name = "pivotTable1",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A3:{toColName(dates.Count() + 2 - 1)}{realShops.Count() * (platforms.Count() + 1) + 3 + 2}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
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
      var ptPart_2 = sheetPart2.AddNewPart<PivotTablePart>("r2");
      ptPart_2.AddPart(pcPart, "r1");
      // // name="PivotTable1" cacheId="5804" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" 
      // // dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"

      var pfs_2 = new PivotFields { Count = 6 };

      var pf1_2 = new PivotField { Axis = PivotTableAxisValues.AxisRow };
      var items1_2 = new Items { Count = (uint)realShops.LongCount() + 1 };
      items1_2.Append(
        Enumerable.Range(0, (int)realShops.LongCount()).Select(v => new Item { Index = (uint)v })
      );
      items1_2.Append(new Item { ItemType = ItemValues.Default });
      pf1_2.Append(items1_2);
      var pf2_2 = new PivotField { Axis = PivotTableAxisValues.AxisColumn, SortType = FieldSortValues.Descending };
      var items2_2 = new Items { Count = (uint)dates.LongCount() + 1 };
      items2_2.Append(
        Enumerable.Range(0, (int)dates.LongCount()).Select(v => new Item { Index = (uint)v }).Reverse()
      );
      items2_2.Append(new Item { ItemType = ItemValues.Default });
      pf2_2.Append(items2_2);
      pfs_2.Append(
        new PivotField(),
        pf1_2,
        new PivotField(),
        new PivotField(),
        new PivotField { DataField = true },
        pf2_2
      );
      var rfs_2 = new RowFields { Count = 1 };
      rfs_2.Append(new Field { Index = 1 });
      var ris_2 = new RowItems { Count = (uint)(realShops.Count()) + 1 };
      var ri_2 = new RowItem();
      ri_2.Append(new MemberPropertyIndex());
      ris_2.Append(ri_2);
      foreach (var i in Enumerable.Range(1, realShops.Count() - 1))
      {
        var r = new RowItem();
        r.Append(new MemberPropertyIndex { Val = i });
        ris_2.Append(r);
      }
      var rig_2 = new RowItem { ItemType = ItemValues.Grand };
      rig_2.Append(new MemberPropertyIndex());
      ris_2.Append(rig_2);

      var cfs_2 = new ColumnFields { Count = 1 };
      cfs_2.Append(new Field { Index = 5 });
      var cis_2 = new ColumnItems { Count = (uint)realShops.LongCount() + 1 };
      var ci_2 = new RowItem();
      ci_2.Append(new MemberPropertyIndex());
      cis_2.Append(ci_2);
      foreach (var i in Enumerable.Range(1, dates.Count() - 1))
      {
        var r = new RowItem();
        r.Append(new MemberPropertyIndex { Val = i });
        cis_2.Append(r);
      }
      var cig_2 = new RowItem { ItemType = ItemValues.Grand };
      cig_2.Append(new MemberPropertyIndex());
      cis_2.Append(cig_2);
      var dfs_2 = new DataFields { Count = 1 };
      dfs_2.Append(new DataField { Name = "Sum of Consume", Field = 4 });
      var pt_2 = new PivotTableDefinition
      {
        Name = "pivotTable2",
        CacheId = 1,
        CreatedVersion = 6,
        UpdatedVersion = 6,
        MinRefreshableVersion = 3,
        DataCaption = "Values",
        Location = new Location { Reference = $"A{realShops.Count() * (platforms.Count() + 1) + 3 + 2 + 2}:{toColName((int)dates.LongCount() + 2 - 1)}{realShops.Count() * (platforms.Count() + 1) + 3 + 2 + 2 + realShops.Count() + 2}", FirstHeaderRow = 1, FirstDataRow = 2, FirstDataColumn = 1 },
        PivotFields = pfs_2,
        RowFields = rfs_2,
        RowItems = ris_2,
        ColumnFields = cfs_2,
        ColumnItems = cis_2,
        DataFields = dfs_2
      };
      // applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" dataCaption="Values" updatedVersion="6" minRefreshableVersion="3" useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" compact="0" compactData="0" multipleFieldFilters="0"
      ptPart_2.PivotTableDefinition = pt_2;


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
      await ExcelBuilder.BuildTable1();

      // var num = 6 - 1;
      // Console.WriteLine(ExcelBuilder.toColName(num));
      // CreateSpreadsheetWorkbook(@"D:\G\d\test.xlsx");
      // q();
      // new GeneratedClass().CreatePackage(@"D:\G\d\gen.xlsx");
    }
  }
}
