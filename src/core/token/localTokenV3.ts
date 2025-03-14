/**
 * File: localTokenV3.ts
 * Description: localToken v3 算法
 * Author: zhx47
 */

import * as ADLER32 from 'adler-32';
import { ClsService } from 'nestjs-cls';
import { Injectable, Logger } from '@nestjs/common';
import { TokenBaseInfoType } from './type';
import { BaseLocalToken } from './baseLocalToken';
import { CustomAlgorithm } from '../algorithm';
import { fromBase64, getRandomIDPro } from '../../utils/baseUtils';

@Injectable()
export class LocalTokenV3 extends BaseLocalToken {
  protected readonly logger = new Logger(LocalTokenV3.name);

  constructor(
    protected readonly clsService: ClsService,
    protected readonly algos: CustomAlgorithm,
  ) {
    super(clsService, algos);
  }

  /**
   * 加密 Token Cipher
   * @param tokenCipherPlain Token Cipher 明文
   * @returns Token Cipher密文
   */
  tokenCipherEncrypt(tokenCipherPlain: string): string {
    const secret2 = this.clsService.get('h5stContext.genLocalTK.cipher.secret2');
    const b = this.algos.AES.encrypt(this.algos.enc.Hex.parse(tokenCipherPlain), this.algos.enc.Utf8.parse(secret2), {
      iv: this.algos.enc.Utf8.parse('0102030405060708'),
    });
    return fromBase64(this.algos.enc.Base64.stringify(b.ciphertext));
  }

  /**
   * 生成 token adler32
   * @param tokenData
   */
  generateTokenAdler32(tokenData: TokenBaseInfoType) {
    const checksum = ADLER32.str(tokenData.magic + tokenData.version + tokenData.platform + tokenData.expires + tokenData.producer + tokenData.expr + tokenData.cipher) >>> 0;
    return ('00000000' + checksum.toString(16)).slice(-8);
  }

  /**
   * 生成校验码
   * @param combinedBytes 原始数据
   * @returns 校验码
   */
  generateChecksum(combinedBytes: Uint8Array): string {
    let checksumValue = ADLER32.buf(combinedBytes);
    checksumValue >>>= 0;
    const checksumHex = '00000000' + checksumValue.toString(16);
    return checksumHex.slice(-8);
  }

  extend() {
    if (this.clsService.get('h5stContext._version') == '3.1') {
      // 3.1 localTk中的参数是变化量，未写死
      const randomIDPro = getRandomIDPro({ size: 32, dictType: 'max' });
      const prefix = randomIDPro.slice(0, 2);
      const secret1 = randomIDPro.slice(0, 12);
      this.clsService.set('h5stContext.genLocalTK.cipher.prefix', prefix);
      this.clsService.set('h5stContext.genLocalTK.cipher.secret1', secret1);
    }
  }
}
