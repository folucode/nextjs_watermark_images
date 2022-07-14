import { Cloudinary, Transformation } from '@cloudinary/url-gen';
import { opacity } from '@cloudinary/url-gen/actions/adjust';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { Position } from '@cloudinary/url-gen/qualifiers';
import { compass } from '@cloudinary/url-gen/qualifiers/gravity';
import { text } from '@cloudinary/url-gen/qualifiers/source';
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [imageSrc, setImageSrc] = useState([]);

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'chukwutosin',
    },
  });

  async function handleOnSubmit(event) {
    event.preventDefault();

    const images = event.target.files;

    let imgArray = [];

    if (images) {
      for (const image of images) {
        const body = new FormData();

        body.append('upload_preset', 'bn1pyehj');

        body.append('file', image);

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/chukwutosin/image/upload',
          {
            method: 'POST',
            body,
          }
        ).then((r) => r.json());
        const myImage = cld.image(response.public_id);

        myImage
          .overlay(
            source(
              text('This is my picture', new TextStyle('arial', 200))
                .textColor('white')
                .transformation(new Transformation().adjust(opacity(60)))
            ).position(new Position().gravity(compass('center')).offsetY(20))
          )
          .format('png');

        const myUrl = myImage.toURL();

        imgArray.push(myUrl);
      }
      setImageSrc(imgArray);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Gallery</title>
        <meta name='description' content="Tosin's image gallery" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Tosin&apos;s image gallery</h1>

        <div>
          <input
            className={styles.file}
            type='file'
            name='uploadImages'
            multiple
            onChange={handleOnSubmit}
          />
        </div>

        <div className={styles.grid}>
          {imageSrc.length > 0
            ? imageSrc.map((img, i) => {
                return (
                  <div key={i} className={styles.card}>
                    <Image src={img} alt={img} width={300} height={300} />
                  </div>
                );
              })
            : ''}
        </div>
      </main>
    </div>
  );
}
