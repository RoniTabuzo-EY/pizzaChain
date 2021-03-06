const express = require("express");

const PizzaCoin  = require("../services/Pizzaco.service");

const router = express.Router({ mergeParams: true });

router.put('/:tokenId', async (req, res, next) => {
  const { tokenId } = req.params;
  try {
    let response = await PizzaCoin.mint(tokenId);
    return res
      .status(201)
      .jsonp({
        success: true,
        message: `${tokenId} successesfully minted`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message, err: err });
  }
});

router.delete('/:tokenId', async (req, res, next) => {
  const { tokenId } = req.params;
  try {
    let response = await PizzaCoin.burn(tokenId);
    return res
      .status(200)
      .jsonp({
        success: true,
        message: `${tokenId} successesfully burnt`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message, err: err });
  }
});

var _default = router;
exports.default = _default;