/**
 * File: algo.controller.ts
 * Description: h5st、sign算法入口
 * Author: zhx47
 */

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { H5stService } from '../services/h5st.service';
import { SignService } from '../services/sign.service';
import { H5stReqBody, SignReqBody } from './dto/req.dto';
import { H5stRes, ResBaseDto, SignRes } from './dto/res.dto';

@Controller()
export class AlgoController {
  constructor(
    private readonly h5stService: H5stService,
    private readonly signService: SignService,
  ) {}

  @Post('/h5st')
  async getH5st(@Body() reqBody: H5stReqBody): Promise<ResBaseDto<H5stRes>> {
    const h5stRes: H5stRes = await this.h5stService.getH5st(reqBody);
    return new ResBaseDto<H5stRes>(h5stRes);
  }

  @Get('/h5st')
  async getH5stFromGet(@Query() reqQuery: H5stReqBody): Promise<ResBaseDto<H5stRes>> {
    const h5stRes: H5stRes = await this.h5stService.getH5st(reqQuery);
    return new ResBaseDto<H5stRes>(h5stRes);
  }

  @Post('/sign')
  getSign(@Body() reqBody: SignReqBody): ResBaseDto<SignRes> {
    const h5stRes: SignRes = this.signService.getSign(reqBody);
    return new ResBaseDto<SignRes>(h5stRes);
  }

  @Get('/sign')
  getSignFromGet(@Query() reqQuery: SignReqBody): ResBaseDto<SignRes> {
    const h5stRes: SignRes = this.signService.getSign(reqQuery);
    return new ResBaseDto<SignRes>(h5stRes);
  }
}
