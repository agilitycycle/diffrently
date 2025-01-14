import axios from 'axios';

// move amazonaws url out of the file into a .env file **
const generateImage = async (imageText) => {
  return await axios.post('https://3aov9b5qbh.execute-api.ap-southeast-2.amazonaws.com/Prod/{generate+}', JSON.stringify({
    data: {
      prompt: `A representation image of ${imageText}`
    }
  }));
}

export {
  generateImage
};