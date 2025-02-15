

exports.randomInt = function (n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n)
}

/**
 * sleep 函数
 *
 * @param {number} ms 毫秒数
 */
exports.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * sleep 函数，慎用，这会阻止一切 js 线程
 *
 * @param {number} delay 毫秒数
 */
exports.sleep1 = function (delay) {
    const start = +new Date()
    while (+new Date().getTime() < start + delay) {}
}

/**
 * 生成 uuid
 *
 * @param {Number} len 长度
 * @param {Number} radix 基数
 *
 * @return {string} uuid
 */
exports.uuid = function (len = 8, radix = 16) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        let i
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        }
    } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        let i
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}
