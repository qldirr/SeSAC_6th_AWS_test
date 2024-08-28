const express = require('express')
const app = express()
const multer = require('multer')
const dotenv = require('dotenv')
const path = require('path')


// aws-sdk와 multer-s3 모듈의 버전이 맞아야함
const aws = require('aws-sdk')
const multers3 = require('multer-s3')

dotenv.config()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// aws s3 설정
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

// multer-s3 미들웨어 설정
const upload = multer({
    storage: multers3(
        {
            s3: s3,
            bucket: process.env.S3_BUCKET_NAME,   //s3 버킷 이름
            acl: 'public-read',   // ACL 권한 설정(ex. public-read, private ...)    // 누구나 파일 접근 가능
            key: function (req, file, cb) {
                cb(null, Date.now().toString() + '-' + file.originalname)   // s3에 저장될 파일 이름 설정
                // 현재 시간과 원본 파일 이름을 조합해 고유한 파일명 생성
            }
        }
    )
})



app.use(express.json())

app.get('/', (req, res) => {
    res.render('index', { imgUrl: '' })   // 초기 렌더링 시 업로드된 이미지 url이 없으므로 빈 문자열 전달
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);   // 업로드된 파일 정보 출력
    const imageUrl = req.file.location
    res.render('index', { imageUrl })

})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`http://localhost:${port}`);

})