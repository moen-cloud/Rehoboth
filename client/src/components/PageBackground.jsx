import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const PageBackground = ({ children, opacity = 0.88 }) => {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, ${opacity}), rgba(249, 250, 251, ${opacity})), url(${generalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {children}
    </div>
  );
};

export default PageBackground;