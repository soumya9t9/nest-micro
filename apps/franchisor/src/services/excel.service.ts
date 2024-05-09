import { Injectable } from '@nestjs/common';
import { Observable, from, map, of } from 'rxjs';
import * as exceljs from 'exceljs';
import * as xlsx from 'xlsx';

import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
	constructor() { }

	downloadExcel(data): Observable<any> {
		const workbook = new exceljs.Workbook();
		// create first sheet with file name exceljs-example
		const worksheet: exceljs.Worksheet = workbook.addWorksheet('exceljs-example');

		worksheet.columns = [
			{ header: 'Route', key: 'route' },
			{ header: 'Origin Country', key: 'originCountry' },
			{ header: 'Origin City L', key: 'originCity' },
			{ header: 'Destination Country', key: 'destinationCountry' },
			{ header: 'Destination City', key: 'destinationCity' }
		];

		data.forEach((val, i, _) => {
			worksheet.addRow(val);
		});
		const filename = new Date().toISOString() + '.xlsx';
		const buffer$ = from(workbook.xlsx.writeBuffer({ filename: filename }));
		return buffer$.pipe(
			map((buffer) => {
				return { buffer, filename };
			})
		);
	}

	readExcelusingXlsx(file: Express.Multer.File) {
		let workbook: xlsx.WorkBook = xlsx.read(file.buffer);
		workbook.SheetNames.forEach(eachSheet => {
			let sheet = workbook.Sheets[eachSheet];
			let data = xlsx.utils.sheet_to_json(sheet);
			console.log(data);
		})
	}

	async readExcelusingExceljs(file: Express.Multer.File) {
		const workbook = new exceljs.Workbook();
		await workbook.xlsx.load(file.buffer);
		workbook.eachSheet(eachSheet => {
			// let data = workbook.xlsx.utils.sheet_to_json(eachSheet);
			let data = eachSheet.getRows(1, eachSheet.actualRowCount)
			console.log(data);
		})
	}

	readAndEditFile(file: Express.Multer.File): Observable<any> {
		const workbook = new exceljs.Workbook();
		return from(workbook.xlsx.load(file.buffer)).pipe(
			map(
				res => {

					workbook.eachSheet(eachSheet => {
						eachSheet.eachRow(row => {
							row.eachCell(cell => {
								// cell.fill = {
								// 	type: 'pattern',
								// 	pattern: 'darkTrellis',
								// 	fgColor: { argb: 'FFFFFF00' },
								// 	bgColor: { argb: 'FF0000FF' }
								// }
							})
						})
					})
					workbook.creator = "soumya";
					const filename = 'excelfile.xlsx'//new Date().toISOString() + '.xlsx';
					return {buffer:workbook.xlsx.writeBuffer({ filename }), filename }
					// const buffer$ = from(workbook.xlsx.writeBuffer({ filename }));
					// return buffer$.pipe(
					// 	map((buffer) => {
					// 		return { buffer, filename };
					// 	})
					// );
				})
		)
	}
}
