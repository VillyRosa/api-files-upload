const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();

// Configuração do Multer para salvar os arquivos no diretório 'uploads' com seus nomes originais
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, raw) => {
        if (err) return cb(err);
  
        const ext = path.extname(file.originalname);
        const fileName = raw.toString('hex') + ext;
        cb(null, fileName);
    });
  }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  // Aqui você pode realizar qualquer processamento adicional com o arquivo,
  // como salvá-lo em um banco de dados ou fazer outras manipulações.

  res.send('Arquivo enviado com sucesso.');
});

// Rota para obter as URLs das imagens
app.get('/imagens', (req, res) => {
  const diretorioImagens = path.join(__dirname, 'uploads');
  const urlsImagens = fs.readdirSync(diretorioImagens)
    .filter(nomeArquivo => nomeArquivo.match(/\.(jpg|jpeg|png|gif)$/i))
    .map(nomeArquivo => `http://localhost:3000/uploads/${nomeArquivo}`);
  res.json(urlsImagens);
});

// Rota para obter as URLs dos áudios
app.get('/audios', (req, res) => {
  const diretorioAudios = path.join(__dirname, 'uploads');
  const urlsAudios = fs.readdirSync(diretorioAudios)
    .filter(nomeArquivo => nomeArquivo.match(/\.(mp3|wav)$/i))
    .map(nomeArquivo => `http://localhost:3000/uploads/${nomeArquivo}`);
  res.json(urlsAudios);
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
