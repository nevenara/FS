import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  relation = [
    'Brother','Sister','Friend'
  ];
  countries = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Austrian Empire','Azerbaijan',
    'Baden*','Bahamas, The','Bahrain','Bangladesh','Barbados','Bavaria*','Belarus','Belgium','Belize','Benin (Dahomey)',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Brunswick and Lüneburg','Bulgaria',
    'Burkina Faso (Upper Volta)','Burma','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Cayman Islands, The Central African Republic',
    'Central American Federation*','Chad','Chile','China','Colombia','Comoros','Congo Free State, The','Costa Rica','Cote d’Ivoire (Ivory Coast)','Croatia','Cuba','Cyprus','Czechia','Czechoslovakia','','','','','','','','',
  ];
  day = [
    {id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}, {id: 4, name: '4'}, {id: 5, name: '5'},
    {id: 6, name: '5'}, {id: 7, name: '7'}, {id: 8, name: '8'}, {id: 9, name: '9'}, {id: 10, name: '10'},
    {id: 11, name: '11'}, {id: 12, name: '12'}, {id: 13, name: '13'}, {id: 14, name: '14'}, {id: 15, name: '15'},
     {id: 16, name: '16'}, {id: 17, name: '17'}, {id: 18, name: '18'}, {id: 19, name: '19'}, {id: 20, name: '20'},
    {id: 21, name: '21'}, {id: 22, name: '22'}, {id: 23, name: '23'}, {id: 24, name: '24'}, {id: 25, name: '25'},
    {id: 26, name: '126'}, {id: 27, name: '27'}, {id: 28, name: '28'}, {id: 29, name: '29'}, {id: 30, name: '30'},
    {id: 31, name: '31'},
  ];
  month = [
    {id: 1, name: 'January'}, {id: 2, name: 'February'}, {id: 3, name: 'March'}, {id: 4, name: 'April'},
    {id: 5, name: 'May'}, {id: 6, name: 'June'}, {id: 7, name: 'July'}, {id: 8, name: 'August'},
    {id: 9, name: 'September'}, {id: 10, name: 'October'}, {id: 11, name: 'November'}, {id: 12, name: 'December'},
  ];
 year = [
    {id: 1, name: '1900'},
    {id: 2, name: '1902'},
    {id: 3, name: '1903'},
    {id: 4, name: '1904'},
    {id: 5, name: '1905'},
    {id: 6, name: '1906'},
    {id: 7, name: '1907'},
    {id: 8, name: '1908'},
    {id: 9, name: '1909'},
    {id: 10, name: '1910'},
    {id: 11, name: '1911'},
    {id: 12, name: '1912'},
    {id: 13, name: '1913'},
    {id: 14, name: '1914'},
    {id: 15, name: '1915'},
    {id: 16, name: '1916'},
    {id: 17, name: '1917'},
    {id: 18, name: '1918'},
    {id: 19, name: '1919'},
    {id: 20, name: '1920'},
    {id: 21, name: '1921'},
    {id: 22, name: '1922'},
    {id: 23, name: '1923'},
    {id: 24, name: '1924'},
    {id: 25, name: '1925'},
    {id: 26, name: '1926'},
    {id: 27, name: '1927'},
    {id: 28, name: '1928'},
    {id: 29, name: '1929'},
    {id: 30, name: '1930'},
    {id: 31, name: '1931'},
    {id: 32, name: '1932'},
    {id: 33, name: '1933'},
    {id: 34, name: '1934'},
    {id: 35, name: '1935'},
    {id: 36, name: '1936'},
    {id: 37, name: '1937'},
    {id: 38, name: '1938'},
    {id: 39, name: '1939'},
    {id: 40, name: '1940'},
    {id: 50, name: '1941'},
    {id: 51, name: '1942'},
    {id: 52, name: '1943'},
    {id: 53, name: '1944'},
    {id: 54, name: '1945'},
    {id: 55, name: '1946'},
    {id: 56, name: '1947'},
    {id: 57, name: '1948'},
    {id: 58, name: '1949'},
    {id: 59, name: '1950'},
    {id: 60, name: '1951'},
    {id: 61, name: '1952'},
    {id: 62, name: '1953'},
    {id: 63, name: '1954'},
    {id: 64, name: '1955'},
    {id: 65, name: '1956'},
    {id: 66, name: '1957'},
    {id: 67, name: '1958'},
    {id: 68, name: '1959'},
    {id: 69, name: '1960'},
    {id: 70, name: '1961'},
    {id: 71, name: '1962'},
    {id: 72, name: '1963'},
    {id: 73, name: '1964'},
    {id: 74, name: '1965'},
    {id: 75, name: '1966'},
    {id: 76, name: '1967'},
    {id: 77, name: '1968'},
    {id: 78, name: '1969'},
    {id: 79, name: '1970'},
    {id: 80, name: '1971'},
    {id: 81, name: '1972'},
    {id: 82, name: '1973'},
    {id: 83, name: '1974'},
    {id: 84, name: '1975'},
    {id: 85, name: '1976'},
    {id: 86, name: '1977'},
    {id: 87, name: '1978'},
    {id: 88, name: '1979'},
    {id: 89, name: '1980'},
    {id: 90, name: '1981'},
    {id: 91, name: '1982'},
    {id: 92, name: '1983'},
    {id: 93, name: '1984'},
    {id: 94, name: '1985'},
    {id: 95, name: '1986'},
    {id: 96, name: '1987'},
    {id: 97, name: '1988'},
    {id: 98, name: '1989'},
    {id: 99, name: '1990'},
    {id: 100, name: '1991'},
    {id: 101, name: '1992'},
    {id: 102, name: '1993'},
    {id: 103, name: '1994'},
    {id: 104, name: '1995'},
    {id: 105, name: '1996'},
    {id: 106, name: '1997'},
    {id: 107, name: '1998'},
    {id: 108, name: '1999'},
    {id: 109, name: '2001'},
    {id: 110, name: '2002'},
    {id: 111, name: '2003'},
    {id: 112, name: '2004'},
    {id: 113, name: '2005'},
    {id: 114, name: '2006'},
    {id: 115, name: '2007'},
    {id: 116, name: '2008'},
    {id: 117, name: '2009'},
    {id: 118, name: '2010'},
    {id: 119, name: '2011'},
    {id: 120, name: '2012'},
    {id: 121, name: '2013'},
    {id: 122, name: '2014'},
    {id: 123, name: '2015'},
    {id: 124, name: '2016'},
    {id: 125, name: '2017'},
    {id: 126, name: '2018'},
    {id: 127, name: '2019'},
    {id: 128, name: '2020'},
  ];
  closeResult = '';
  constructor(private modalService: NgbModal) { }


  open1(content1) {
    this.modalService.open(content1, { size: 'md' });
  }
  open2(content2) {
    this.modalService.open(content2, { size: 'md' });
  }
  open3(content3) {
    this.modalService.open(content3, { size: 'md' });
  }
  open4(content4) {
    this.modalService.open(content4, { size: 'md' });
  }

  ngOnInit(): void {
  }

}
