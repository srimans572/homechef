import React from 'react';

const Card = ({ image, title, quantity, chefName, price }) => {
  if(quantity===0){
    return(<div></div>)
  }
  return (
    <div style={styles.card}>
      <img src={image} alt="Food" style={styles.image} />
      {/* <div style={styles.content}> */}
      <div style={styles.titleContainer}>
          <p style={styles.title}>{title}</p>
     </div>
        <div style={styles.chooserContainer}>
          <input type="number" value={quantity} readOnly style={styles.chooser} />
        </div>
        <p style={styles.chefName}>{chefName}</p>
        <p style={styles.price}>${price}</p>
      {/* </div> */}
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '20px', // Space between cards
    alignItems: 'center', // Center items vertically within the card
    marginTop:'40px',
    marginLeft:'15px',
  },
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginRight: '20px', // Space between image and content
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 10px',
    height: '100px', // Fixed height for title container
    overflow: 'hidden',
    marginRight:'90px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0',
    lineHeight: '1.2',
  },
  chooserContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    marginRight:'135px'
  },
  label: {
    marginRight: '10px',
  },
  chooser: {
    width: '60px',
    textAlign: 'center',
  },
  chefName: {
    fontSize: '14px',
    color: 'gray',
    margin: '0 0 10px 0',
    marginRight:'140px'
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0',
    marginRight:'70px'
  },
};

export default Card;
