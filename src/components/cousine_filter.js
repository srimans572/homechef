import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const CuisineFilter = () => {
  const [selected, setSelected] = useState(sessionStorage.getItem("searchText"));

  const handleSelected = (name) => {
    sessionStorage.setItem("searchText", name=="all"?"":name)
    setSelected(name);
    window.location.reload()
  }

  const buttons = [
    { name: 'all', icon: 'fas fa-th' },
    { name: 'Italian', icon: 'fas fa-pizza-slice' },
    { name: 'Chinese', icon: 'fas fa-dragon' },
    { name: 'Mexican', icon: 'fas fa-guitar' },
    { name: 'Indian', icon: 'fas fa-gopuram' },
    { name: 'Japanese', icon: 'fas fa-torii-gate' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        {buttons.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => handleSelected(name)}
            style={{
              ...styles.button,
              ...(selected === name ? styles.selectedButton : {}),
            }}
          >
            <i className={icon} style={styles.icon}></i> {/* Icon */}
            <div>{name}</div> {/* Text */}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '50px auto',
  },
  title: {
    fontFamily: 'Poppins',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px', // Increase gap to space buttons more
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '15px', // Increase padding for larger buttons
    fontSize: '16px',
    fontFamily: 'Poppins',
    borderBottom: '2px solid transparent',
    transition: 'border-bottom 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectedButton: {
    borderBottom: '2px solid #000', // Change this color to your desired underline color
    fontWeight: '600', // Slightly bolder text
  },
  icon: {
    fontSize: '24px', // Adjust icon size
    marginBottom: '5px', // Space between icon and text
  },
};

export default CuisineFilter;
