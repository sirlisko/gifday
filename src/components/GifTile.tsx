import React from "react";
import type { Image } from "types";

interface Props {
  gifObj: Image;
  dynamic?: boolean;
}

const GifTile = ({ gifObj, dynamic }: Props) =>
  gifObj ? (
    <div>
      {dynamic && <img src={gifObj.gif.still} alt={gifObj.text} />}
      <video
        key={gifObj.gif.gif}
        title={gifObj.text}
        loop
        autoPlay
        muted
        playsInline
      >
        <source src={gifObj.gif.gif} type="video/mp4" />
      </video>
    </div>
  ) : (
    <></>
  );

export default GifTile;
