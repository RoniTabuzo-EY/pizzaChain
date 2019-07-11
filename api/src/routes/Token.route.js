const express = require("express");
const web3 = require("web3");

const Token = require("../services/Token.service");

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  const { user } = req.auth;

  try {
    let response = await Token.tokensOwned(user);

    return res.
      status(200)
      .jsonp({
        success: true,
        message: `Token listing for ${user} retrieved`,
        data: response
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message });
  }

});

router.put('/:tokenId', async (req, res, next) => {
  const { tokenId } = req.params;
  const { user } = req.auth;

  try {
    let response;
    if (Object.entries(req.body).length === 0) { // req.body is empty
      response = await Token.mint(tokenId, false, user);
    } else {
      response = await Token.mint(tokenId, req.body, user);
    }

    return res
      .status(201)
      .jsonp({
        success: true,
        message: `${tokenId} minted`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message });
  }
});

router.delete('/:tokenId', async (req, res, next) => {
  const { tokenId } = req.params;
  const { user } = req.auth;
  try {
    let response = await Token.burn(tokenId, user);
    return res
      .status(200)
      .jsonp({
        success: true,
        message: `${tokenId} burnt`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message });
  }
});

router.get('/:tokenId', async (req, res, next) => {
  const { tokenId } = req.params;
  const { user } = req.auth;
  try {
    let response = await Token.getData(tokenId, user);
    return res
      .status(200)
      .jsonp({
        success: true,
        message: `${tokenId} retrieved`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message });
  }
});

router.post('/:tokenId', async (req, res, next) => {
  const { tokenId } = req.params;
  const { user } = req.auth;
  try {
    let response = await Token.setData(tokenId, req.body, user);
    return res
      .status(200)
      .jsonp({
        success: true,
        message: `${tokenId} updated`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message });
  }
});

/**
 * Expects to address { address: to } in req.body
 */
router.post('/:tokenId/transfer', async (req, res, next) => {
  const { tokenId } = req.params;
  const { address } = req.body;
  const { user } = req.auth;

  if (!address || !web3.utils.isAddress(address)) {
    return res.status(400).jsonp({
      success: false,
      message: 'invalid transfer to address',
    })
  }

  try {
    let response = await Token.transfer(tokenId, address, user);
    return res
      .status(200)
      .jsonp({
        success: true,
        message: `${tokenId} updated`,
        data: response,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).jsonp({ success: false, message: err.message });
  }
});

var _default = router;
//exports.default = _default;
module.exports = router;
