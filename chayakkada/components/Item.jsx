// components/Item.jsx
import { motion } from 'framer-motion';

const Item = ({ id, image, price, onBuy }) => {
    const handleClick = () => {
        onBuy(id);
    };

    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <img src={image} alt={`Item ${id}`} style={{ width: '200px', height: 'auto' }} />
            <p>Price: {price} ETH</p>
        </motion.div>
    );
};

export default Item;