import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';

export async function POST(request: Request) {
  try {
    const { pageUrls } = await request.json();
    
    if (!Array.isArray(pageUrls) || pageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty page URLs' },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const pdfBuffer = await generateMergedPDF(browser, pageUrls);
    
    await browser.close();
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=annual-report.pdf',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}

async function generateMergedPDF(browser: any, urls: string[]): Promise<Buffer> {
  const merger = new PDFMerger();
  const page = await browser.newPage();
  
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.emulateMediaType('screen');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      });
      await merger.add(pdfBuffer);
    } catch (error) {
      console.error(`Failed to generate PDF for ${url}:`, error);
    }
  }
  await page.close();
  return await merger.saveAsBuffer();
}