import catImg from '../../assets/catpng.jpg';

export function ImageViewer() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', background: '#c0c0c0', padding: 8,
    }}>
      <img
        src={catImg}
        alt="Links_crush.png"
        style={{
          maxWidth: '100%', maxHeight: '100%',
          objectFit: 'contain',
          border: '2px solid',
          borderColor: '#808080 #fff #fff #808080',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
}
