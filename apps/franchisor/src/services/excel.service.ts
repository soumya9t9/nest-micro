import { Injectable } from '@nestjs/common';
import { Observable, from, map, of } from 'rxjs';
import * as XLSX from 'exceljs';
import * as xlsx from 'xlsx';

import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
	constructor() {}

	downloadExcel(data): Observable<any> {
		const workbook = new XLSX.Workbook();
		// create first sheet with file name exceljs-example
		const worksheet = workbook.addWorksheet('exceljs-example');

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

  readExcelusingXlsx(file:Express.Multer.File) {
    let workbook = xlsx.read(file.buffer);
    workbook.SheetNames.forEach(eachSheet => {
      let data = xlsx.utils.sheet_to_json(workbook.Sheets[eachSheet]);
      console.log(data);
    })
  }
}
