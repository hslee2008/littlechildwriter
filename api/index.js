const https = require('https')
const axiosModule = require('axios')
const express = require('express')
const cheerio = require('cheerio')
const qs = require('qs')
const cors = require('cors')

const app = express()
const axios = axiosModule.create({
  timeout: 60000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
  })
})

const area = {
  서울: 'http://reading.ssem.or.kr/',
  부산: 'http://reading.pen.go.kr/',
  대구: 'http://reading.edunavi.kr/',
  인천: 'http://book.ice.go.kr/',
  광주: 'http://book.gen.go.kr/',
  대전: 'http://reading.edurang.net/',
  울산: 'https://reading.ulsanedu.kr/',
  세종: 'https://reading.sje.go.kr/',
  경기: 'https://reading.gglec.go.kr/',
  강원: 'https://reading.gweduone.net/',
  충북: 'http://reading.cbe.go.kr/',
  충남: 'http://reading.edus.or.kr/',
  전북: 'https://reading.jbedu.kr/',
  전남: 'http://reading.jnei.go.kr/',
  경북: 'http://reading.gyo6.net/',
  경남: 'https://reading.gne.go.kr/',
  제주: 'https://reading.jje.go.kr/'
}
const NO_IMAGE =
  'https://books.google.co.kr/googlebooks/images/no_cover_thumb.gif'

isEmptyOrNull = str => {
  if (str === null || str.trim() === '') return true
  return false
}

getSchoolFromName = async (local, name) => {
  const option = {
    method: 'POST',
    data: qs.stringify({
      currentPage: 1,
      returnUrl: '',
      kind: 1,
      txtSearchWord: '%EB%8F%84%EC%84%9C%EA%B2%80%EC%83%89',
      searchGbn: '',
      selEducation: 'all',
      selSchool: 'all',
      schoolSearch: encodeURI(name)
    }),
    url: `${area[local]}r/newReading/search/schoolListData.jsp`
  }
  const res = await axios(option)

  const cookies = res.headers['set-cookie']
  if (!cookies) throw new Error('쿠키가 없습니다.')

  let cookie = ''
  cookies.forEach(c => {
    cookie += c.split(';')[0] + '; '
  })
  cookie = cookie.substring(0, cookie.length - 2)

  if (res.data.includes('>0</span>개의'))
    throw new Error(`학교 "${name}"을(를) 찾을 수 없습니다.`)

  const hasTest = res.data.indexOf('테스트')
  if (hasTest !== -1) res.data = res.data.substring(hasTest)

  let code = res.data.substring(
    res.data.indexOf("javascript:selectSchool('") + 25
  )
  code = code.substring(0, code.indexOf("'"))

  let schName = res.data.substring(
    res.data.indexOf("javascript:selectSchool('") + 25
  )
  schName = schName.substring(schName.indexOf('>') + 1)
  schName = schName.substring(0, schName.indexOf('</a>'))
  return Promise.resolve({ name: schName, code, cookie })
}

setSchoolCodeSetting = async (local, code, cookie) => {
  const option = {
    method: 'POST',
    url: `${area[local]}r/newReading/search/schoolCodeSetting.jsp`,
    data: qs.stringify({
      schoolCode: code,
      returnUrl: '',
      kind: 1,
      txtSearchWord: '도서검색',
      searchGbn: ''
    }),
    headers: {
      Cookie: cookie
    }
  }
  await axios(option)
}

searchBookFromSchoolName = async (local, book, school) => {
  const result = {}
  try {
    if (isEmptyOrNull(school))
      throw new Error('학교 이름이 비어있을 순 없습니다.')
    if (isEmptyOrNull(book)) throw new Error('책 이름이 비어있을 순 없습니다.')
    if (!area[local])
      throw new Error(
        `지원하지 않는 지역입니다. 지원하는 지역: ${Object.keys(area).join(
          ', '
        )}`
      )

    const { code, cookie, name } = await getSchoolFromName(local, school)
    result.schoolCode = code
    result.schoolName = name

    await setSchoolCodeSetting(local, code, cookie)

    const option = {
      method: 'POST',
      url: `${area[local]}r/newReading/search/schoolSearchResult.jsp`,
      data: qs.stringify({
        currentPage: 1,
        controlNo: '',
        memberSerial: '',
        bookInfo: '',
        boxCmd: '',
        printCmd: '',
        pageParamInfo: '',
        prevPageInfo: '',
        searchPageName: 'schoolSearchForm',
        schSchoolCode: code,
        division1: 'ALL',
        searchCon1: encodeURI(book),
        connect1: 'A',
        division2: 'TITL',
        searchCon2: '',
        connect2: 'A',
        division3: 'PUBL',
        searchCon3: '',
        dataType: 'ALL',
        lineSize: 100,
        cbSort: 'STIT'
      }),
      headers: {
        Cookie: cookie
      }
    }

    result.result = []

    const body = (await axios(option)).data

    if (body.includes('검색결과가 없습니다.'))
      throw new Error(`"${book}"을(를) 찾을 수 없습니다.`)

    const $ = cheerio.load(body)
    $('div.bd_list.bd_book_list.school_lib > ul').each(function () {
      const title = $(this).find('div.bd_list_title > a > span').text().trim()
      const writer = $(this)
        .find('div.bd_list_writer > span.dd')
        .text()
        .trim()
        .replace(/;/g, ', ')
      const company = $(this)
        .find('div.bd_list_company > span.dd')
        .text()
        .trim()
      const callNumber = $(this)
        .find('div.bd_list_year > span.dd')
        .text()
        .trim()
      const canRental =
        $(this).find('div.book_save > div > div').text() === '대출가능'
      const imgUrl = $(this).find('div.book_image > img').attr('src')
      const previewImage = isEmptyOrNull(imgUrl)
        ? NO_IMAGE
        : area[local] + imgUrl.substring(1)

      result.result.push({
        title,
        writer,
        company,
        callNumber,
        canRental,
        previewImage
      })
    })
    result.status = 'success'
  } catch (e) {
    result.status = 'fail'
    result.result = e.message
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return Promise.resolve(result)
  }
}

app.use(cors())

app.listen(3000, () => {
  console.log('서버 열림')
})

app.get('/', async (req, res) => {
  const bookName = req.query.book
  const schoolName = req.query.school
  const localName = req.query.local

  const data = await searchBookFromSchoolName(localName, bookName, schoolName)
  res.json(data)
})
