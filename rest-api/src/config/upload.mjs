import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

class UploadImage {
  URL = path.basename('public');

  constructor() {}

storage() {
   return multer.diskStorage({

     destination: (req, file, cb) => {
      if (!fs.existsSync(path.resolve(import.meta.dirname,'..','..',this.URL))) {
        fs.mkdirSync(path.resolve(import.meta.dirname, '..','..',this.URL));
      }
      cb(null, path.resolve(this.URL));
    },
     filename: (req, file, cb) => {
      if(req.body.rg){
       var name = req.body.rg;
      } else if (req.body.avatar) {
        var name = req.body.avatar;
      } else {
        var name = req.body.qrcode
      }
      const ext = path.extname(file.originalname);
      cb(null, `${name}-${Date.now()}${ext}`);

     }
   })
}

fileFilter() {
  /*
    Essa configuração vai nos ajudar com
    1 - A validação do arquivo
  */
  return (
    req,
    file,
    cb
  ) => {
    //Utilizaremos a Lib mime-types para identificar o tipo do arquivo
    const type = mime.extension(file.mimetype);

    /*
      Este array será montado a conditions de validação
      No caso aceitará apenas imagens como "png", "jpg", "jpeg"
    */
    const conditions = ["png", "jpg", "jpeg"];

    //Perguntamos se existe algum desses valores no type
    if (conditions.includes(`${type}`)) {
      //Caso exista, teremos nossa imagem linda maravilhosa
      cb(null, true);
    }

    //Caso não de certo a validação não efetuaremos o upload
    cb(null, false);
  };
}

getConfig() {

  return{

    storage: this.storage(),

    fileFilter: this.fileFilter(),
  };
};

delete(req, foto){
    if(foto) {
      fs.unlinkSync(
        path.resolve(__dirname, '..', '..', this.URL, foto)
      );
    }
  }
}
export default new UploadImage();
