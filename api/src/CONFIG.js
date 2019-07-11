
let env = 'LOCAL';

const CONFIG = {
  pizza: {
    address: '0x8bce8a46135cac9f70fe327a266f39d623c96860',
  },

  flour: {
    address: '0xf0e83d2b690604123a487b44439a934d498e51ad',
  },

  cheese: {
    address: '0xf0e83d2b690604123a487b44439a934d498e51ad',
  },

};

const props = {
  LOCAL: {
    rpc: {
      host: 'http://localhost',
      port: "8545"
    }
  }
};

/**
 * get the appropriate environment config
 */
let getProps = () => {
    return props[env]
}


//export default CONFIG;
module.exports = {
  CONFIG,
  getProps
}
