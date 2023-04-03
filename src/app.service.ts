import { Injectable } from '@nestjs/common';
import { SpheronClient, ProtocolEnum } from '@spheron/storage';

@Injectable()
export class AppService {
  private spheronClient = new SpheronClient({
    token: process.env.SPHERONTOKEN,
  });

  getHello() {
    return 'Hello World!';
  }

  async uploadToSpheron(file: Express.Multer.File) {
    let currentlyUploaded = 0;
    const { protocolLink } = await this.spheronClient.upload(file.path, {
      protocol: ProtocolEnum.IPFS,
      onUploadInitiated: (uploadId) => {
        console.log(`Upload with id ${uploadId} started...`);
      },
      onChunkUploaded: (uploadedSize, totalSize) => {
        currentlyUploaded += uploadedSize;
        console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
      },
      name: 'fileUpload',
    });

    return {
      link: `${protocolLink}/${file.filename}`,
    };
  }
}
