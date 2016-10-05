var Crypter = React.createClass({
  displayName: 'Crypter',

  getInitialState: function () {
    var freqTable = {
      'English': { a: 0.08167, b: 0.01492, c: 0.02782, d: 0.04253, e: 0.12702, f: 0.02228, g: 0.02015, h: 0.06094, i: 0.06966, j: 0.00153, k: 0.00772, l: 0.04025, m: 0.02406, n: 0.06749, o: 0.07507, p: 0.01929, q: 0.00095, r: 0.05987, s: 0.06327, t: 0.09056, u: 0.02758, v: 0.00978, w: 0.02360, x: 0.00150, y: 0.01974, z: 0.00074 },
      'Latin': { a: 0.0889, b: 0.0158, c: 0.0399, d: 0.0277, e: 0.1138, f: 0.0093, g: 0.0121, h: 0.0069, i: 0.1144, l: 0.0315, m: 0.0538, n: 0.0628, o: 0.0540, p: 0.0303, q: 0.0151, r: 0.0667, s: 0.0760, t: 0.0800, u: 0.0846, v: 0.0096, x: 0.0060, y: 0.0007, z: 0.0001 },
      'French': { a: 0.07636, b: 0.00901, c: 0.03260, d: 0.03669, e: 0.14715, f: 0.01066, g: 0.00866, h: 0.00737, i: 0.07529, j: 0.00613, k: 0.00049, l: 0.05456, m: 0.02968, n: 0.07095, o: 0.05796, p: 0.02521, q: 0.01362, r: 0.06693, s: 0.07948, t: 0.07244, u: 0.06311, v: 0.01838, w: 0.00074, x: 0.00427, y: 0.00128, z: 0.00326, à: 0.00486, â: 0.00051, œ: 0.00018, ç: 0.00085, è: 0.00271, é: 0.01504, ê: 0.00218, ë: 0.00008, î: 0.00045, ï: 0.00005, ô: 0.00023, ù: 0.00058 },
      'German': { a: 0.06516, b: 0.01886, c: 0.02732, d: 0.05076, e: 0.16396, f: 0.01656, g: 0.03009, h: 0.04577, i: 0.06550, j: 0.00268, k: 0.01417, l: 0.03437, m: 0.02534, n: 0.09776, o: 0.02594, p: 0.00670, q: 0.00018, r: 0.07003, s: 0.07270, t: 0.06154, u: 0.04166, v: 0.00846, w: 0.01921, x: 0.00034, y: 0.00039, z: 0.01134, ä: 0.00578, ö: 0.00443, ß: 0.00307, ü: 0.00995 },
      'Spanish': { a: 0.11525, b: 0.02215, c: 0.04019, d: 0.05010, e: 0.12181, f: 0.00692, g: 0.01768, h: 0.00703, i: 0.06247, j: 0.00493, k: 0.00011, l: 0.04967, m: 0.03157, n: 0.06712, o: 0.08683, p: 0.02510, q: 0.00877, r: 0.06871, s: 0.07977, t: 0.04632, u: 0.02927, v: 0.01138, w: 0.00017, x: 0.00215, y: 0.01008, z: 0.00467, á: 0.00502, é: 0.00433, í: 0.00725, ñ: 0.00311, ó: 0.00827, ú: 0.00168, ü: 0.00012 },
      'Portuguese': { a: 0.14634, b: 0.01043, c: 0.03882, d: 0.04992, e: 0.12570, f: 0.01023, g: 0.01303, h: 0.00781, i: 0.06186, j: 0.00397, k: 0.00015, l: 0.02779, m: 0.04738, n: 0.04446, o: 0.09735, p: 0.02523, q: 0.01204, r: 0.06530, s: 0.06805, t: 0.04336, u: 0.03639, v: 0.01575, w: 0.00037, x: 0.00253, y: 0.00006, z: 0.00470, à: 0.00072, â: 0.00562, á: 0.00118, ã: 0.00733, ç: 0.00530, é: 0.00337, ê: 0.00450, í: 0.00132, ô: 0.00635, ó: 0.00296, ú: 0.00207, ü: 0.00026 },
      'Esperanto': { a: 0.12117, b: 0.00980, c: 0.00776, d: 0.03044, e: 0.08995, f: 0.01037, g: 0.01171, h: 0.00384, i: 0.10012, j: 0.03501, k: 0.04163, l: 0.06104, m: 0.02994, n: 0.07955, o: 0.08779, p: 0.02755, r: 0.05914, s: 0.06092, t: 0.05276, u: 0.03183, v: 0.01904, z: 0.00494, ĉ: 0.00657, ĝ: 0.00691, ĥ: 0.00022, ĵ: 0.00055, ŝ: 0.00385, ŭ: 0.00520 },
      'Italian': { a: 0.11745, b: 0.00927, c: 0.04501, d: 0.03736, e: 0.11792, f: 0.01153, g: 0.01644, h: 0.00636, i: 0.10143, j: 0.00011, k: 0.00009, l: 0.06510, m: 0.02512, n: 0.06883, o: 0.09832, p: 0.03056, q: 0.00505, r: 0.06367, s: 0.04981, t: 0.05623, u: 0.03011, v: 0.02097, w: 0.00033, x: 0.00003, y: 0.00020, z: 0.01181, à: 0.00635, è: 0.00263, ì: 0.00030, ò: 0.00002, ù: 0.00166 },
      'Turkish': { a: 0.12920, b: 0.02844, c: 0.01463, d: 0.05206, e: 0.09912, f: 0.00461, g: 0.01253, h: 0.01212, i: 0.09600, j: 0.00034, k: 0.05683, l: 0.05922, m: 0.03752, n: 0.07987, o: 0.02976, p: 0.00886, r: 0.07722, s: 0.03014, t: 0.03314, u: 0.03235, v: 0.00959, y: 0.03336, z: 0.01500, ç: 0.01156, ğ: 0.01125, ı: 0.05114, ö: 0.00777, ş: 0.01780, ü: 0.01854 },
      'Swedish': { a: 0.09383, b: 0.01535, c: 0.01486, d: 0.04702, e: 0.10149, f: 0.02027, g: 0.02862, h: 0.02090, i: 0.05817, j: 0.00614, k: 0.03140, l: 0.05275, m: 0.03471, n: 0.08542, o: 0.04482, p: 0.01839, q: 0.00020, r: 0.08431, s: 0.06590, t: 0.07691, u: 0.01919, v: 0.02415, w: 0.00142, x: 0.00159, y: 0.00708, z: 0.00070, å: 0.01338, ä: 0.01797, ö: 0.01305 },
      'Polish': { a: 0.10503, b: 0.01740, c: 0.03895, d: 0.03725, e: 0.07352, f: 0.00143, g: 0.01731, h: 0.01015, i: 0.08328, j: 0.01836, k: 0.02753, l: 0.02564, m: 0.02515, n: 0.06237, o: 0.06667, p: 0.02445, r: 0.05243, s: 0.05224, t: 0.02475, u: 0.02062, v: 0.00012, w: 0.05813, x: 0.00004, y: 0.03206, z: 0.04852, ą: 0.00699, ć: 0.00743, ę: 0.01035, ł: 0.02109, ń: 0.00362, ó: 0.01141, ś: 0.00814, ź: 0.00078, ż: 0.00706 },
      'Dutch': { a: 0.07486, b: 0.01584, c: 0.01242, d: 0.05933, e: 0.18910, f: 0.00805, g: 0.03403, h: 0.02380, i: 0.06499, j: 0.01460, k: 0.02248, l: 0.03568, m: 0.02213, n: 0.10032, o: 0.06063, p: 0.01570, q: 0.00009, r: 0.06411, s: 0.03730, t: 0.06790, u: 0.01990, v: 0.02850, w: 0.01520, x: 0.00036, y: 0.00035, z: 0.01390 },
      'Danish': { a: 0.06025, b: 0.02000, c: 0.00565, d: 0.05858, e: 0.15453, f: 0.02406, g: 0.04077, h: 0.01621, i: 0.06000, j: 0.00730, k: 0.03395, l: 0.05229, m: 0.03237, n: 0.07240, o: 0.04636, p: 0.01756, q: 0.00007, r: 0.08956, s: 0.05805, t: 0.06862, u: 0.01979, v: 0.02332, w: 0.00069, x: 0.00028, y: 0.00698, z: 0.00034, å: 0.01190, æ: 0.00872, ø: 0.00939 },
      'Icelandic': { a: 0.10110, b: 0.01043, d: 0.01575, e: 0.06418, f: 0.03013, g: 0.04241, h: 0.01871, i: 0.07578, j: 0.01144, k: 0.03314, l: 0.04532, m: 0.04041, n: 0.07711, o: 0.02166, p: 0.00789, r: 0.08581, s: 0.05630, t: 0.04953, u: 0.04562, v: 0.02437, x: 0.00046, y: 0.00900, á: 0.01799, æ: 0.00867, ð: 0.04393, é: 0.00647, í: 0.01570, ö: 0.00777, ó: 0.00994, þ: 0.01455, ú: 0.00613, ý: 0.00228 },
      'Finnish': { a: 0.12217, b: 0.00281, c: 0.00281, d: 0.01043, e: 0.07968, f: 0.00194, g: 0.00392, h: 0.01851, i: 0.10817, j: 0.02042, k: 0.04973, l: 0.05761, m: 0.03202, n: 0.08826, o: 0.05614, p: 0.01842, q: 0.00013, r: 0.02872, s: 0.07862, t: 0.08750, u: 0.05008, v: 0.02250, w: 0.00094, x: 0.00031, y: 0.01745, z: 0.00051, å: 0.00003, ä: 0.03577, ö: 0.00444 },
      'Czech': { a: 0.08421, b: 0.00822, c: 0.00740, d: 0.03475, e: 0.07562, f: 0.00084, g: 0.00092, h: 0.01356, i: 0.06073, j: 0.01433, k: 0.02894, l: 0.03802, m: 0.02446, n: 0.06468, o: 0.06695, p: 0.01906, q: 0.00001, r: 0.04799, s: 0.05212, t: 0.05727, u: 0.02160, v: 0.05344, w: 0.00016, x: 0.00027, y: 0.01043, z: 0.01503, á: 0.00867, č: 0.00462, ď: 0.00015, é: 0.00633, ě: 0.01222, í: 0.01643, ň: 0.00007, ó: 0.00024, ř: 0.00380, š: 0.00688, ť: 0.00006, ú: 0.00045, ů: 0.00204, ý: 0.00995, ž: 0.00721 }
    };
    var allLetters = 'abcdefghijklmnopqrstuvwxyzàâáåäãąæœçĉćčďðèéêëęěĝğĥîìíïıĵłñńňòöôóøřŝşśšßťþùúŭüůýźżž';
    var letters = {
      'English': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      'Latin': ['a', 'b', 'c', 'd', 'e', 'f', 'z', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'v', 'x'],
      'French': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'à', 'â', 'œ', 'ç', 'è', 'é', 'ê', 'ë', 'î', 'ï', 'ô', 'ù'],
      'German': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'ö', 'ß', 'ü'],
      'Spanish': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'á', 'é', 'í', 'ñ', 'ó', 'ú', 'ü'],
      'Portuguese': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'à', 'â', 'á', 'ã', 'ç', 'é', 'ê', 'í', 'ô', 'ó', 'ú', 'ü'],
      'Esperanto': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'z', 'ĉ', 'ĝ', 'ĥ', 'ĵ', 'ŝ', 'ŭ'],
      'Italian': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'à', 'è', 'ì', 'ò', 'ù'],
      'Turkish': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', 'ç', 'ğ', 'ı', 'ö', 'ş', 'ü'],
      'Swedish': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'ä', 'ö'],
      'Polish': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
      'Dutch': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      'Danish': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'æ', 'ø'],
      'Icelandic': ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'x', 'y', 'á', 'æ', 'ð', 'é', 'í', 'ö', 'ó', 'þ', 'ú', 'ý'],
      'Finnish': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'ä', 'ö'],
      'Czech': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř', 'š', 'ť', 'ú', 'ů', 'ý', 'ž']
    };
    return { input: "", output: "", googleChart: false, allLetters: allLetters, letters: letters, freqTable: freqTable, charFreqAnlys: false, language: "English", caesarCipher: false, caesarCipherShiftlang: "English", caesarCipherShiftLang: "English", indexOfCoinc: false, indexOfCoincMaxLen: 20, keywordCipher: false, keywordCipherAction: 'encipher', keywordCipherEnMap: {}, keywordCipherDeMap: {}, charFreqAnlysOrder: 'alphabetAscending', charFreqAnlysChart: null, vigenereCipher: false, vigenereCipherAction: 'decipher', vigenereCipherKey: "", vigenereCipherKeyLen: 0, vigenereCipherKeyLenMax: 10, vigenereCipherAInoobGuess: true, vigenereCipherResult: '', columnarTransposition: false, columnarTranspositionColumns: 4, columnarTranspositionState: {}, columnarTranspositionResultMax: 0, columnarTranspositionResultRemain: 0, columnarTranspositionDrag: null };
  },
  updateLang: function (e) {
    this.setState({ language: e.target.value, caesarCipherShiftLang: e.target.value }, function () {
      this.caesarCipher();
      this.indexOfCoinc();
    });
  },
  columnarTranspositionGuess: function () {
    if (!this.state.quadgram) {
      $.ajax({ url: 'https://ainoob.com/third_party/english_quadgrams.txt' }).done(function (data) {
        var list = data.split('\n');
        var len = 0;
        var quadgram = {};
        var temp;
        for (var i in list) {
          if (list[i].length > 2) len += parseInt(list[i].split(' ')[1]);
        }
        for (var i in list) {
          temp = list[i].split(' ');
          quadgram[temp[0]] = Math.log10(parseInt(temp[1]) / len);
        }
        this.setState({ quadgram: quadgram, quadLen: len }, this.columnarTranspositionGuess);
      }.bind(this));
      return;
    }
    var list = [];
    var resultList = [];
    var remain = '';
    for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
      remain += i;
    }
    this.combination(list, '', remain);
    var strList = {};
    var lenMax = 0;
    for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
      strList[i] = $('#columnarTranspositionColumnDiv' + i).val();
      if (strList[i].length > lenMax) {
        lenMax = strList[i].length;
      }
    }
    for (var i in list) {
      var str = '';
      for (var j = 0; j < lenMax * this.state.columnarTranspositionColumns; j++) {
        var temp = strList[list[i][j % this.state.columnarTranspositionColumns]][Math.floor(j / this.state.columnarTranspositionColumns)];
        if (temp) str += temp;
      }
      resultList.push(str);
    }
    var orderList = [];
    var max = 0;
    var quad;
    for (var i = 0; i < resultList.length; i++) {
      var value = 0;
      var str = resultList[i].toUpperCase();
      for (var j = 0; j < str.length - 3; j++) {
        quad = str.slice(j, j + 4);
        if (quad in this.state.quadgram) {
          value += this.state.quadgram[quad];
        } else {
          value += Math.log10(0.01 / this.state.quadLen);
        }
      }
      if (value > max) {
        max = value;
      }
      orderList.push([value, resultList[i], list[i]]);
    }
    orderList.sort(function (a, b) {
      return b[0] - a[0];
    });
    /*for(var i=0;i<resultList.length;i++){
      var str=resultList[i].toUpperCase();
      if(str.indexOf('TRANSFORM')!=-1){
      }
    }
    */
    //$('#columnarTranspositionResult').val(orderList[0][1]);
    //NNN
    $('#columnarTranspositionAllResults').empty();
    for (var i = 0; i < 30 && i < orderList.length; i++) {
      $('#columnarTranspositionAllResults').append('Score:' + orderList[i][0] + ' Key: ' + orderList[i][2] + '<textarea id="columnarTranspositionResult' + i + '" style="margin-left:5px;width:90%;height:30px">' + orderList[i][1] + '</textarea>');
    }
    $('#columnarTranspositionResult').val(orderList[0][1]);
  },
  columnarTranspositionAllResults: function () {
    var list = [];
    var remain = '';
    $('#columnarTranspositionAllResults').empty();
    for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
      remain += i;
    }
    this.combination(list, '', remain);
    var valueList = {};
    var lenMax = 0;
    for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
      valueList[i] = $('#columnarTranspositionColumnDiv' + i).val();
      if (valueList[i].length > lenMax) {
        lenMax = valueList[i].length;
      }
    }
    for (var i in list) {
      var str = '';
      for (var j = 0; j < lenMax * this.state.columnarTranspositionColumns; j++) {
        var temp = valueList[list[i][j % this.state.columnarTranspositionColumns]][Math.floor(j / this.state.columnarTranspositionColumns)];
        if (temp) str += temp;
      }
      //NNNN
      $('#columnarTranspositionAllResults').append('<textarea id="columnarTranspositionResult' + i + '" style="margin-left:5px;width:90%;height:30px">' + str + '</textarea>');
    }
  },
  combination: function (list, prev, remain) {
    if (remain.length == 0) {
      list.push(prev);
    } else {
      for (var i in remain) {
        this.combination(list, prev + remain[i], remain.replace(remain[i], ''));
      }
    }
  },
  columnarTranspositionDrag: function (e) {
    switch (e.type) {
      case 'mousedown':
        if (e.target.id.indexOf('columnarTranspositionColumnDiv') != '-1') {
          var id = parseInt(e.target.id.slice('columnarTranspositionColumnDiv'.length));
          this.setState({ columnarTranspositionDrag: id });
        }
        break;
      case 'dragend':
        //console.log(e.target);
        //console.log(e.clientX+' '+e.clientY);
        if (e.clientX != 0 || e.clientY != 0) {
          var x, y;
          if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
          } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
          }
          var orderList = [];
          for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
            var xx = $('#columnarTranspositionColumnDiv' + i).offset().left;
            orderList.push([xx, i]);
          }
          orderList.sort(function (a, b) {
            return a[0] - b[0];
          });
          var list = [];
          for (var i = 0; i < orderList.length; i++) {
            list.push(orderList[i][1]);
          }
          for (var i = 0; i < list.length; i++) {
            var j = list[i];
            var xx = $('#columnarTranspositionColumnDiv' + j).offset().left;
            if (x < xx) {
              if (j == this.state.columnarTranspositionDrag) {
                break;
              } else if (list.indexOf(this.state.columnarTranspositionDrag) == list.indexOf(j) - 1) {
                continue;
              } else {
                tempDiv = $('#columnarTranspositionColumnDiv' + this.state.columnarTranspositionDrag).clone();
                $('#columnarTranspositionColumnDiv' + this.state.columnarTranspositionDrag).remove();
                $(tempDiv).insertBefore('#columnarTranspositionColumnDiv' + j);
                this.columnarTranspositionResult();
                break;
              }
            } else if (i == list.length - 1 && list.indexOf(this.state.columnarTranspositionDrag) != list.length - 1) {
              tempDiv = $('#columnarTranspositionColumnDiv' + this.state.columnarTranspositionDrag).clone();
              $('#columnarTranspositionColumnDiv' + this.state.columnarTranspositionDrag).remove();
              $(tempDiv).insertAfter('#columnarTranspositionColumnDiv' + j);
              this.columnarTranspositionResult();
            }
          }
        }
        break;
      case 'drag':

        break;
      default:
        console.log(e.type);
    }
  },
  columnarTranspositionResult: function () {
    var orderList = [];
    var result = '';
    for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
      var xx = $('#columnarTranspositionColumnDiv' + i).offset().left;
      orderList.push([xx, i]);
    }
    orderList.sort(function (a, b) {
      return a[0] - b[0];
    });
    var maxLen = 0;
    var parts = {};
    var list = [];
    for (var i = 0; i < orderList.length; i++) {
      list.push(orderList[i][1]);
    }
    for (var i = 0; i < list.length; i++) {
      //var temp=document.getElementById('columnarTranspositionColumnDiv'+i);
      //console.log(temp.value);
      parts[i] = $('#columnarTranspositionColumnDiv' + list[i]).val();
      if (parts[i].length > maxLen) {
        maxLen = parts[i].length;
      }
    }
    for (var i = 0; i < maxLen; i++) {
      for (var j = 0; j < this.state.columnarTranspositionColumns; j++) {
        if (parts[j][i]) result += parts[j][i];
      }
    }
    $('#columnarTranspositionResult').text(result);
  },
  updateColumnarTranspositionColumns: function (e) {
    var value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    this.setState({ columnarTranspositionColumns: value }, this.columnarTranspositionInit);
  },
  columnarTransposition: function () {
    columnarTranspositionDiv = document.getElementById('columnarTranspositionDiv');
    if (this.state.columnarTransposition) {
      columnarTranspositionDiv.style.display = "block";
      this.columnarTranspositionInit();
    } else {
      columnarTranspositionDiv.style.display = "none";
    }
  },
  columnarTranspositionResize: function () {
    var temp = document.getElementById('columnarTranspositionResize');
    var height = temp.style.height;
    for (var i = 0; i < this.state.columnarTranspositionColumns; i++) {
      var id = 'columnarTranspositionColumnDiv' + i;
      temp = document.getElementById(id);
      temp.style.height = height;
    }
    temp = document.getElementById('columnarTranspositionSubDiv');
    temp.style.height = parseInt(height) + 10 + 'px';
  },
  columnarTranspositionInit: function () {
    var state = {};
    var columns = this.state.columnarTranspositionColumns;
    for (var i = 0; i < columns; i++) {
      state[i] = i;
    }
    var letterMatchPattern = '';
    for (var i in this.state.allLetters) {
      letterMatchPattern += this.state.allLetters[i] + '|';
    }
    letterMatchPattern = letterMatchPattern.slice(0, -1);
    var letters = this.state.input.match(new RegExp(letterMatchPattern, 'gi')) || [];
    var letterParts = {};
    var cutLen = Math.ceil(letters.length / columns);
    for (var i = 0; i < columns; i++) {
      letterParts[i] = letters.slice(i * cutLen, (i + 1) * cutLen).join('');
    }
    this.setState({ columnarTranspositionState: state });
    for (var i = 0; i < columns; i++) {
      var id = 'columnarTranspositionColumnDiv' + i;
      temp = document.getElementById(id);
      if (!temp) $('#columnarTranspositionSubDiv').append('<textarea class="draggable" draggable=true id="' + id + '" style="loat:left;margin-left:5px;width:15px;height:100%;overflow:hidden;resize:vertical;border: 0px solid pink;border-top:solid 10px pink;font-size:15px"></textarea>');
      //$('#columnarTranspositionSubDiv').append('<div id="'+id+'" draggable=true style="float:left;width:26px;background-color:pink;height:200px;overflow:hidden;resize:vertical;margin-left:5px;border: 1px solid pink;"><textarea id="'+id2+'" style="float:left;width:16px;height:100%;overflow:hidden;resize:vertical;border: 1px solid blue;font-size:15px"></textarea></div>');
      var partTextarea = document.getElementById(id);
      partTextarea.value = letterParts[i];
    }
    var ii = columns;
    temp = document.getElementById('columnarTranspositionColumnDiv' + ii);
    while (temp) {
      $('#columnarTranspositionColumnDiv' + ii).remove();
      ii++;
      temp = document.getElementById('columnarTranspositionColumnDiv' + ii);
    }
    this.columnarTranspositionResult();
  },
  updateVigenereCipherAction: function (e) {
    var action = e.target.value;
    if (action == 'encipher') {
      $('#vigenereCipherKeyLenMaxDiv').hide();
      $('#vigenereCipherAInoobGuessDiv').hide();
      $('#vigenereCipherKey').prop('disabled', false);
      this.setState({ vigenereCipherAInoobGuess: false });
    } else {
      $('#vigenereCipherKeyLenMaxDiv').show();
      $('#vigenereCipherAInoobGuessDiv').show();
    }
    this.setState({ vigenereCipherAction: action }, this.vigenereCipher);
  },
  updateVigenereCipherKey: function (e) {
    switch (e.target.id) {
      case 'vigenereCipherKey':
        var key = e.target.value;
        var maxLen = key.length > this.state.vigenereCipherKeyLenMax ? key.length : this.state.vigenereCipherKeyLenMax;
        this.setState({ 'vigenereCipherKey': key, 'vigenereCipherKeyLen': e.target.value.length, 'vigenereCipherKeyLenMax': maxLen }, this.vigenereCipher);
        break;
      case 'vigenereCiperKeyLen':
        this.setState({ 'vigenereCipherKeyLen': e.target.value }, function () {
          this.setState({ 'vigenereCipherKeyLen': this.state.vigenereCipherKey.slice(0, e.target.value) }, this.vigenereCipher);
        }.bind(this));
        break;
      case 'vigenereCipherKeyLenMax':
        this.setState({ 'vigenereCipherKeyLenMax': e.target.value }, this.vigenereCipher);
        break;
    }
  },
  vigenereCipherAInoobGuess: function () {
    var ic;
    var totalIc;
    var maxTotalIc = 0;
    var charFreq = this.state.freqTable[this.state.language];
    var letterParts;
    var s;
    var letterMatchPattern = "";
    var keyLen;
    var key = '';
    var alphabet = this.state.letters[this.state.language];
    var shiftMax = alphabet.length;
    for (var i in this.state.allLetters) {
      letterMatchPattern += this.state.allLetters[i] + '|';
    }
    letterMatchPattern = letterMatchPattern.slice(0, -1);
    var letters = this.state.input.match(new RegExp(letterMatchPattern, 'gi'));
    for (var i = 1; i <= this.state.vigenereCipherKeyLenMax; i++) {
      s = "";
      totalIc = 0;
      letterParts = {};
      for (var j = 0; j < i; j++) {
        letterParts[j] = "";
      }
      for (var j in letters) {
        letterParts[j % i] += letters[j];
      }
      for (var j = 0; j < i; j++) {
        ic = 0;
        for (var k in charFreq) {
          var num = (letterParts[j].match(new RegExp(k, 'gi')) || []).length;
          ic += num * (num - 1);
        }
        var letterPartLength = letterParts[j].length;
        ic = ic / (letterPartLength * (letterPartLength - 1));
        ic = parseFloat(ic.toFixed(6));
        if (j != 0) s += ',';
        s += ic;
        totalIc += ic;
      }
      totalIc = parseFloat((totalIc / i).toFixed(6));
      if (totalIc > maxTotalIc) {
        maxTotalIc = totalIc;
        keyLen = i;
      }
    }
    this.setState({ vigenereCipherKeyLen: keyLen });
    var chiSquareMin;
    var keyLetter;
    letterParts = {};
    for (var i = 0; i < keyLen; i++) {
      letterParts[i] = "";
    }
    for (var i in letters) {
      letterParts[i % keyLen] += letters[i];
    }
    var resultParts = {};
    for (var i = 0; i < keyLen; i++) {
      chiSquareMin = null;
      for (var j = 0; j <= shiftMax; j++) {
        var temp = this.getShiftResult(letterParts[i], j);
        var chiSquareVal = this.getChiSquare(temp);
        if (!(chiSquareMin && chiSquareMin < chiSquareVal)) {
          chiSquareMin = chiSquareVal;
          keyLetter = alphabet[(alphabet.length + (alphabet.length - j)) % alphabet.length];
        }
      }
      key += keyLetter;
    }
    this.setState({ vigenereCipherKey: key }, this.vigenereCipherGetResult);
  },
  vigenereCipherGetResult: function () {
    var letterParts = {};
    var s;
    var letterMatchPattern = "";
    var alphabet = this.state.letters[this.state.language];
    var key = this.state.vigenereCipherKey;
    var keyLen = key.length;
    for (var i in this.state.allLetters) {
      letterMatchPattern += this.state.allLetters[i] + '|';
    }
    letterMatchPattern = letterMatchPattern.slice(0, -1);
    var letters = this.state.input.match(new RegExp(letterMatchPattern, 'gi'));
    for (var i in letters) {
      if (!letterParts[i % keyLen]) letterParts[i % keyLen] = letters[i];else letterParts[i % keyLen] += letters[i];
    }
    for (var i = 0; i < keyLen; i++) {
      if (this.state.vigenereCipherAction == "encipher") letterParts[i] = this.getShiftResult(letterParts[i], alphabet.indexOf(key[i]));else letterParts[i] = this.getShiftResult(letterParts[i], alphabet.length - alphabet.indexOf(key[i]));
    }
    var result = "";
    for (var i = 0; i < letters.length; i++) {
      result += letterParts[i % keyLen][parseInt(i / keyLen)];
    }
    this.setState({ vigenereCipherResult: result });
  },
  updateVigenereCipherAInoobGuess: function (e) {
    //JJJ possibly making reccommendation
    var ainoobGuess = e.target.checked;
    if (ainoobGuess) {
      $('#vigenereCipherKeyLenMax').prop('disabled', false);
      $('#vigenereCipherKey').prop('disabled', true);
      $('#vigenereCipherKeyLen').prop('disabled', true);
    } else {
      $('#vigenereCipherKeyLenMax').prop('disabled', true);
      $('#vigenereCipherKey').prop('disabled', false);
      $('#vigenereCipherKeyLen').prop('disabled', true);
    }
    this.setState({ vigenereCipherAInoobGuess: ainoobGuess }, this.vigenereCipher);
  },
  vigenereCipher: function () {
    //JJJ
    var vigenereCipherDiv = document.getElementById('vigenereCipherDiv');
    if (this.state.vigenereCipher) {
      vigenereCipherDiv.style.display = "block";
      if (this.state.vigenereCipherAInoobGuess) {
        this.vigenereCipherAInoobGuess();
      } else {
        this.vigenereCipherGetResult();
      }
    } else {
      vigenereCipherDiv.style.display = "none";
    }
  },
  keywordCipher: function (e) {
    var keywordCipherDiv = document.getElementById('keywordCipherDiv');
    if (e && e.target && e.target.id == "keywordCipher") {
      var keywordCipherEnMap = {};
      var keywordCipherDeMap = {};
      var alphabet = this.state.letters[this.state.language].join('');
      var alphabet2 = this.state.letters[this.state.language].join('');
      for (i in alphabet) {
        if (i < e.target.value.length) {
          keywordCipherEnMap[alphabet[i]] = e.target.value[i];
          keywordCipherDeMap[e.target.value[i]] = alphabet[i];
          alphabet2 = alphabet2.replace(e.target.value[i], '');
        } else {
          keywordCipherEnMap[alphabet[i]] = alphabet2[i - e.target.value.length];
          keywordCipherDeMap[alphabet2[i - e.target.value.length]] = alphabet[i];
        }
      }
      this.setState({ keywordCipherEnMap: keywordCipherEnMap, keywordCipherDeMap: keywordCipherDeMap }, this.keywordCipher);
      return;
    }
    if (this.state.keywordCipher) {
      keywordCipherDiv.style.display = 'block';
      var result = document.getElementById('keywordCipherResult');
      result.value = this.state.input.replace(/[A-Z]/gi, function (x) {
        var caseShift = 0;
        if (x.charCodeAt(0) < 'a'.charCodeAt(0)) caseShift = 'a'.charCodeAt(0) - 'A'.charCodeAt(0);
        //JJJ
        var asciiCode = x.charCodeAt(0) + caseShift;
        if (asciiCode < 'a'.charCodeAt(0)) asciiCode += 26;
        if (asciiCode > 'z'.charCodeAt(0)) asciiCode -= 26;
        if (this.state.keywordCipherAction == 'encipher') {
          if (this.state.keywordCipherEnMap[String.fromCharCode(asciiCode)]) {
            asciiCode = this.state.keywordCipherEnMap[String.fromCharCode(asciiCode)].charCodeAt(0);
            asciiCode -= caseShift;
          } else {
            asciiCode = '*'.charCodeAt(0);
          }
        } else {
          if (this.state.keywordCipherEnMap[String.fromCharCode(asciiCode)]) {
            asciiCode = this.state.keywordCipherDeMap[String.fromCharCode(asciiCode)].charCodeAt(0);
            asciiCode -= caseShift;
          } else {
            asciiCode = '*'.charCodeAt(0);
          }
        }
        return String.fromCharCode(asciiCode);
      }.bind(this));
    } else {
      keywordCipherDiv.style.display = 'none';
    }
  },
  getChiSquare: function (str) {
    var value = 0;
    var length = str.length;
    for (ch in this.state.freqTable[this.state.language]) {
      var expVal = length * this.state.freqTable[this.state.language][ch];
      var realVal = (str.match(new RegExp(ch, 'gi')) || []).length;
      value += Math.pow(realVal - expVal, 2) / expVal;
    }
    return value;
  },
  updateCaesarCipherShiftLang: function (e) {
    this.setState({ caesarCipherShiftLang: e.target.value }, this.caesarCipher);
  },
  caesarCipher: function () {
    var caesarCipherDiv = document.getElementById('caesarCipherDiv');
    if (this.state.caesarCipher) {
      //JJJJ
      var letters = this.state.letters[this.state.caesarCipherShiftlang];
      var maxShift = letters.length - 1;
      var temp = document.getElementById('caesarCipherResultDiv' + maxShift);
      if (!temp) {
        for (var i = 0; i <= maxShift; i++) {
          temp = document.getElementById('caesarCipherResultDiv' + i);
          if (!temp) {
            if (i < 10) $('#caesarCipherSubDiv').append('<div id="caesarCipherResultDiv' + i + '">shift ' + i + ':&nbsp;&nbsp;&nbsp;<textarea id="caesarCipherResult' + i + '" style="width:90%;height:50px"/></div>');else $('#caesarCipherSubDiv').append('<div id="caesarCipherResultDiv' + i + '">shift ' + i + ': <textarea id="caesarCipherResult' + i + '" style="width:90%;height:50px"/></div>');
          }
        }
      }
      var ii = 1;
      var temp = document.getElementById('caesarCipherResultDiv' + (maxShift + ii));
      while (temp) {
        $('#caesarCipherResultDiv' + (maxShift + ii)).remove();
        ii++;
        var temp = document.getElementById('caesarCipherResultDiv' + (maxShift + ii));
      }
      caesarCipherDiv.style.display = 'block';
      var chiSquareList = [];
      var minChiSquare;
      //JJJ
      for (var i = 0; i <= maxShift; i++) {
        var id = 'caesarCipherResult' + i;
        var elem = document.getElementById(id);
        elem.value = '';
        elem.value += this.getShiftResult(this.state.input, i, this.state.caesarCipherShiftLang);
        var chiSquareVal = this.getChiSquare(elem.value);
        chiSquareList.push(chiSquareVal);
        minChiSquare = minChiSquare && minChiSquare < chiSquareVal ? minChiSquare : chiSquareVal;
      }
      for (i in chiSquareList) {
        var result = document.getElementById('caesarCipherResult' + i);
        result.style.backgroundColor = 'rgba(0,255,0,' + Math.pow(minChiSquare / chiSquareList[i], 0.5) + ')';
      }
    } else {
      caesarCipherDiv.style.display = 'none';
    }
  },
  getShiftResult: function (input, shift, language) {
    if (!language) language = this.state.language;
    var table = this.state.freqTable[this.state.language];
    var letters = this.state.letters[language];
    var matchPattern = "";
    for (i in table) {
      matchPattern += i + '|';
    }
    matchPattern = matchPattern.slice(0, -1);
    var result = input.replace(new RegExp(matchPattern, 'gi'), function (x) {
      var upperCase = false;
      if (x.toUpperCase() == x) {
        upperCase = true;
        x = x.toLowerCase();
      }
      var index = letters.indexOf(x);
      if (index == -1) {
        return '*';
      }
      index = (index + shift) % letters.length;
      x = letters[index];
      if (upperCase) {
        x = x.toUpperCase();
      }
      return x;
    });
    return result;
  },
  updateIndexOfCoincMaxLen: function (e) {
    this.setState({ indexOfCoincMaxLen: parseInt(e.target.value) }, this.indexOfCoinc);
  },
  indexOfCoinc: function () {
    if (this.state.indexOfCoinc) {
      //JJJ
      var temp = document.getElementById('indexOfCoincResult' + this.state.indexOfCoincMaxLen);
      if (!temp) {
        for (var i = 1; i <= this.state.indexOfCoincMaxLen; i++) {
          temp = document.getElementById('indexOfCoincResult' + i);
          if (!temp) {
            var result = $("<div>", { "id": "indexOfCoincResult" + i, "class": "indexOfCoincResult" });
            var resultDescr = $('<span class="fleft mleft9" >Period' + i + ': </span>');
            var resultA = $("<input>", { "id": "indexOfCoincResultA" + i, "class": "indexOfCoincResultA fleft mleft9" });
            var resultB = $("<textarea>", { "id": "indexOfCoincResultB" + i, "class": "indexOfCoincResultB width70 mleft9" });
            $(result).append(resultDescr);
            $(result).append(resultA);
            $(result).append(resultB);
            $('#indexOfCoincSubDiv').append(result);
            // $('#indexOfCoincSubDiv').append('<br />');
          }
        }
      }
      var ii = 1;
      var temp = document.getElementById('indexOfCoincResult' + (this.state.indexOfCoincMaxLen + ii));
      while (temp) {
        $('#indexOfCoincResult' + (this.state.indexOfCoincMaxLen + ii)).remove();
        ii++;
        var temp = document.getElementById('indexOfCoincResult' + (this.state.indexOfCoincMaxLen + ii));
      }
      indexOfCoincDiv.style.display = 'block';
      var ic;
      var totalIc;
      var maxTotalIc = 0;
      var charFreq = this.state.freqTable[this.state.language];
      var letterParts;
      var s;
      var letterMatchPattern = "";
      for (var i in this.state.allLetters) {
        letterMatchPattern += this.state.allLetters[i] + '|';
      }
      letterMatchPattern = letterMatchPattern.slice(0, -1);
      var letters = this.state.input.match(new RegExp(letterMatchPattern, 'gi'));
      for (var i = 1; i <= this.state.indexOfCoincMaxLen; i++) {
        s = "";
        totalIc = 0;
        letterParts = {};
        for (var j = 0; j < i; j++) {
          letterParts[j] = "";
        }
        for (var j in letters) {
          letterParts[j % i] += letters[j];
        }
        for (var j = 0; j < i; j++) {
          ic = 0;
          for (var k in charFreq) {
            var num = (letterParts[j].match(new RegExp(k, 'gi')) || []).length;
            ic += num * (num - 1);
          }
          var letterPartLength = letterParts[j].length;
          ic = ic / (letterPartLength * (letterPartLength - 1));
          ic = parseFloat(ic.toFixed(6));
          if (j != 0) s += ',';
          s += ic;
          totalIc += ic;
        }
        totalIc = parseFloat((totalIc / i).toFixed(6));
        maxTotalIc = totalIc > maxTotalIc ? totalIc : maxTotalIc;
        var result = document.getElementById('indexOfCoincResultA' + i);
        result.value = totalIc;
        var result = document.getElementById('indexOfCoincResultB' + i);
        result.value = s;
      }
      for (var i = 1; i <= this.state.indexOfCoincMaxLen; i++) {
        var result = document.getElementById('indexOfCoincResultA' + i);
        var totalIc = result.value;
        result.style.backgroundColor = 'rgba(0,255,0,' + Math.pow(totalIc / maxTotalIc, 3) + ')';
      }
    } else {
      indexOfCoincDiv.style.display = 'none';
    }
  },
  charFreqAnlys: function (noLoading) {
    var charFreqAnlysDiv = document.getElementById('charFreqAnlysDiv');
    if (this.state.charFreqAnlys && !noLoading) {
      charFreqAnlysDiv.style.display = 'block';
      if (!this.state.charFreqAnlysChart) {
        if (!this.state.googleChart) {
          google.charts.load('current', { 'packages': ['corechart'] });
          this.setState({ googleChart: true });
        }
        google.charts.setOnLoadCallback(function () {
          var chart = new google.visualization.BarChart(document.getElementById('charFreqAnlysChart'));
          this.setState({ charFreqAnlysChart: chart }, this.charFreqAnlys);
        }.bind(this));
      }
      var charFreq = {};
      for (i in this.state.input) {
        if (!(this.state.input[i] in charFreq)) {
          charFreq[this.state.input[i]] = 1;
        } else {
          charFreq[this.state.input[i]]++;
        }
      }
      var dataArray = $.map(charFreq, function (v, k) {
        return [[k, v]];
      });
      var sortFunc;
      switch (this.state.charFreqAnlysOrder) {
        case 'alphabetAscending':
          sortFunc = function (a, b) {
            return a[0].charCodeAt(0) - b[0].charCodeAt(0);
          };
          break;
        case 'alphabetDescending':
          sortFunc = function (a, b) {
            return b[0].charCodeAt(0) - a[0].charCodeAt(0);
          };
          break;
        case 'freqAscending':
          sortFunc = function (a, b) {
            return a[1] - b[1];
          };
          break;
        case 'freqDescending':
          sortFunc = function (a, b) {
            return b[1] - a[1];
          };
          break;
      }
      dataArray.sort(sortFunc);
      if (dataArray.length == 0) {
        dataArray.push(['No input!', 10000000]);
      }
      dataArray.unshift(['Character', 'Frequency']);
      if (!google.visualization) return;
      var data = new google.visualization.arrayToDataTable(dataArray);
      var options = { 'title': 'Character frequency analysis chart' };
      $('#charFreqAnlysChart').height(data.getNumberOfRows() * 33);
      this.state.charFreqAnlysChart.draw(data, options);
    } else {
      charFreqAnlysDiv.style.display = 'none';
    }
  },
  updateKeywordCipherAction: function (e) {
    this.setState({ keywordCipherAction: e.target.value }, this.keywordCipher);
  },
  updateCharFreqAnlysOrder: function (e) {
    this.setState({ charFreqAnlysOrder: e.target.value }, this.charFreqAnlys);
  },
  onOff: function (e, param) {
    var id = e.target.id;
    var state = e.target.checked;
    var obj = {};
    obj[id] = state;
    this.setState(obj, function () {
      this[id](param);
    });
  },
  translateInput: function () {
    try {
      this.setState({ output: this.state.input.replace(new RegExp(this.state.regexpPattern, this.state.regexpFlag), this.state.func) });
    } catch (e) {
      console.log(e);
    }
  },
  setRegExpFunc: function (e, noTranslation) {
    var v;
    var obj = {};
    if (e.target.id == 'func') v = Function('x', e.target.value);else v = e.target.value;
    obj[e.target.id] = v;
    if (noTranslation) {
      this.setState(obj);
    } else {
      this.setState(obj, this.translateInput);
    }
  },
  changeInput: function (e) {
    this.setState({ input: e.target.value }, function () {
      this.charFreqAnlys();
      this.translateInput();
      this.caesarCipher();
      this.keywordCipher();
      this.indexOfCoinc();
      this.vigenereCipher();
      this.columnarTranspositionInit();
    });
  },
  loadExample: function (e) {
    switch (e.target.value) {
      case '0':
        this.onOff({ target: $('#charFreqAnlys')[0] }, true);
        $('#regexpPattern').val('');
        this.setRegExpFunc({ target: $('#regexpPattern')[0] }, true);
        $('#regexpFlag').val('');
        this.setRegExpFunc({ target: $('#regexpFlag')[0] }, true);
        $('#func').val("");
        this.setRegExpFunc({ target: $('#func')[0] }, true);
        $('#crypterInput').val('');
        this.changeInput({ target: $('#crypterInput')[0] });
        $('#crypterOutput').val('');
        break;
      case '1':
        $('#charFreqAnlys').prop('checked', true);
        this.onOff({ target: $('#charFreqAnlys')[0] }, true);
        $('#regexpPattern').val('.');
        this.setRegExpFunc({ target: $('#regexpPattern')[0] }, true);
        $('#regexpFlag').val('g');
        this.setRegExpFunc({ target: $('#regexpFlag')[0] }, true);
        $('#func').val("var map={X:'T',Y:'H',Q:'I',T:'S',B:'A',R:'N',C:'O',E:'B','0':' '};\nif(x in map)\nreturn map[x];\n  return '*';");
        this.setRegExpFunc({ target: $('#func')[0] }, true);
        $('#crypterInput').val('XYQT0QT0BQRCCE');
        this.changeInput({ target: $('#crypterInput')[0] });
        break;
      case '2':
        $('#charFreqAnlys').prop('checked', true);
        this.onOff({ target: $('#charFreqAnlys')[0] }, true);
        $('#caesarCipher').prop('checked', true);
        this.onOff({ target: $('#caesarCipher')[0] }, true);
        $('#regexpPattern').val('[A-Z]');
        this.setRegExpFunc({ target: $('#regexpPattern')[0] }, true);
        $('#regexpFlag').val('g');
        this.setRegExpFunc({ target: $('#regexpFlag')[0] }, true);
        $('#func').val("var asciiCode=x.charCodeAt(0)-5;\nif(asciiCode<'A'.charCodeAt(0))\n  asciiCode+=26;\nreturn String.fromCharCode(asciiCode);");
        this.setRegExpFunc({ target: $('#func')[0] }, true);
        $('#crypterInput').val('BTWQI BFW N BFX YMJ QFXY RFOTW HTSKQNHY BMJWJYMJ UWNRFWD RJFSX TK JSHWDUYNSL FSI IJHWDUYNSL FSI GWJFPNSL HNUMJW RJXXFLJX BFX GD UJSHNQ FSI UFUJW. NY BFX FQXT YMJ KNWXY RFOTW HTSKQNHY BMJWJ WFINT BFX ZXJI YT YWFSXRNY HWDUYTLWFRX. XNSHJ WFINT NX F GWTFIHFXY RJINZR, YMNX RJFSY YMFY FSDGTID TS DTZW KWJVZJSHD HTZQI NSYJWHJUY DTZW RJXXFLJX.');
        this.changeInput({ target: $('#crypterInput')[0] });
        break;
    }
  },
  render: function () {
    return React.createElement(
      'div',
      { id: 'crypter' },
      'Plaintext Language:',
      React.createElement(
        'select',
        { onChange: this.updateLang },
        React.createElement(
          'option',
          { value: 'English' },
          'English'
        ),
        React.createElement(
          'option',
          { value: 'Latin' },
          'Latin'
        ),
        React.createElement(
          'option',
          { value: 'French' },
          'French'
        ),
        React.createElement(
          'option',
          { value: 'German' },
          'German'
        ),
        React.createElement(
          'option',
          { value: 'Spanish' },
          'Spanish'
        ),
        React.createElement(
          'option',
          { value: 'Portuguese' },
          'Portuguese'
        ),
        React.createElement(
          'option',
          { value: 'Esperanto' },
          'Esperanto'
        ),
        React.createElement(
          'option',
          { value: 'Italian' },
          'Italian'
        ),
        React.createElement(
          'option',
          { value: 'Turkish' },
          'Turkish'
        ),
        React.createElement(
          'option',
          { value: 'Swedish' },
          'Swedish'
        ),
        React.createElement(
          'option',
          { value: 'Polish' },
          'Polish'
        ),
        React.createElement(
          'option',
          { value: 'Dutch' },
          'Dutch'
        ),
        React.createElement(
          'option',
          { value: 'Danish' },
          'Danish'
        ),
        React.createElement(
          'option',
          { value: 'Icelandic' },
          'Icelandic'
        ),
        React.createElement(
          'option',
          { value: 'Finnish' },
          'Finnish'
        ),
        React.createElement(
          'option',
          { value: 'Czech' },
          'Czech'
        )
      ),
      '   Load example:',
      React.createElement(
        'select',
        { onChange: this.loadExample },
        React.createElement(
          'option',
          { value: '0' },
          ' '
        ),
        React.createElement(
          'option',
          { value: '1' },
          'Basic one'
        ),
        React.createElement(
          'option',
          { value: '2' },
          'Dooley\'s examle'
        )
      ),
      React.createElement(
        'h2',
        null,
        'Crypter'
      ),
      React.createElement(
        'span',
        { style: { float: 'left' } },
        'Input:    '
      ),
      React.createElement('textarea', { placeholder: 'Put what you want to encipher or decipher here', id: 'crypterInput', onChange: this.changeInput, style: { width: '90%', height: '100px' } }),
      React.createElement('br', null),
      React.createElement(
        'span',
        { style: { float: 'left' } },
        'Output: '
      ),
      React.createElement('textarea', { placeholder: 'Make sure you defined input, patter, flag and function, or load example to see how things work', id: 'crypterOutput', readOnly: true, value: this.state.output, style: { width: '90%', height: '100px' }, readOnly: true }),
      React.createElement('br', null),
      React.createElement(
        'span',
        { style: { float: 'left' } },
        'RegExp(',
        React.createElement(
          'span',
          { title: 'The command is input.replace(/pattern/flag,function(x){function})Write regular expression, and function to tell crypter how to translate the given input' },
          '?'
        ),
        ') Pattern(',
        React.createElement(
          'span',
          { title: 'things to match inside / and /' },
          '?'
        ),
        ') :'
      ),
      ' ',
      React.createElement('textarea', { placeholder: '\'.\' to match all characters, \'[A-Z]\' to match uppercase letters, \'\\\\d+\' to match numbers, etc', style: { float: 'left' }, id: 'regexpPattern', onChange: this.setRegExpFunc }),
      React.createElement(
        'span',
        { style: { float: 'left' } },
        'Flag(',
        React.createElement(
          'span',
          { title: 'g, gi, m, any RegExp flag' },
          '?'
        ),
        '): '
      ),
      React.createElement('textarea', { placeholder: 'things like \'g\', \'gi\', \'m\', etc', id: 'regexpFlag', onChange: this.setRegExpFunc }),
      React.createElement('br', null),
      React.createElement(
        'span',
        { style: { float: 'left' } },
        'Function(',
        React.createElement(
          'span',
          { title: 'what to replace the matching string, the variable x is the string' },
          '?'
        ),
        '): '
      ),
      React.createElement('textarea', { placeholder: '\'return x;\' will return the exactly same thing, \'return \'1\' will make every matched string to \'1\'', id: 'func', onChange: this.setRegExpFunc, style: { width: '66%', height: '100px' } }),
      React.createElement(
        'h2',
        null,
        'Crypter Analysis Tools'
      ),
      React.createElement(
        'div',
        { id: 'crypterTools' },
        React.createElement('input', { type: 'checkbox', id: 'charFreqAnlys', onChange: this.onOff }),
        'Character Frequency Analysis',
        React.createElement('input', { type: 'checkbox', id: 'columnarTransposition', onChange: this.onOff }),
        'Columnar Transposition',
        React.createElement('input', { type: 'checkbox', id: 'vigenereCipher', onChange: this.onOff }),
        'Vigenere Cipher',
        React.createElement('input', { type: 'checkbox', id: 'keywordCipher', onChange: this.onOff }),
        React.createElement(
          'span',
          { title: 'Given keyword z, it will do monoalphabet cipher: zabcdefg...' },
          'Keyword Cipher'
        ),
        React.createElement('input', { type: 'checkbox', id: 'indexOfCoinc', onChange: this.onOff }),
        React.createElement(
          'span',
          { title: 'The chance that two random selected letter are equal, used in Vigenere decryption' },
          'Index of Coincidence'
        ),
        React.createElement('input', { type: 'checkbox', id: 'caesarCipher', onChange: this.onOff }),
        React.createElement(
          'span',
          { title: 'Display total of 26 possibilities of shifting the alphabet' },
          'Caesar Cipher'
        )
      ),
      React.createElement(
        'div',
        { id: 'charFreqAnlysDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } },
        React.createElement(
          'h3',
          null,
          'Character Frequency Analysis'
        ),
        React.createElement(
          'select',
          { onChange: this.updateCharFreqAnlysOrder },
          React.createElement(
            'option',
            { value: 'alphabetAscending' },
            'Alphabet ascending'
          ),
          React.createElement(
            'option',
            { value: 'alphabetDescending' },
            'Alphabet descending'
          ),
          React.createElement(
            'option',
            { value: 'freqAscending' },
            'Frequency ascending'
          ),
          React.createElement(
            'option',
            { value: 'freqDescending' },
            'Frequency descending'
          )
        ),
        React.createElement('div', { id: 'charFreqAnlysChart' })
      ),
      React.createElement(
        'div',
        { id: 'vigenereCipherDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } },
        'Action: ',
        React.createElement(
          'select',
          { onChange: this.updateVigenereCipherAction, value: this.state.vigenereCipherAction },
          React.createElement(
            'option',
            { value: 'decipher' },
            'Decipher'
          ),
          React.createElement(
            'option',
            { value: 'encipher' },
            'Encipher'
          )
        ),
        React.createElement(
          'span',
          { id: 'vigenereCipherAInoobGuessDiv' },
          'AInoob Guess',
          React.createElement(
            'span',
            { title: 'Automatically compute the key that has the best possibility' },
            '(?)'
          ),
          ': ',
          React.createElement('input', { type: 'checkbox', checked: this.state.vigenereCipherAInoobGuess, onChange: this.updateVigenereCipherAInoobGuess })
        ),
        React.createElement('br', null),
        React.createElement(
          'span',
          { id: 'vigenereCipherKeyLenMaxDiv' },
          'Max key length: ',
          React.createElement('input', { id: 'vigenereCipherKeyLenMax', onChange: this.updateVigenereCipherKey, value: this.state.vigenereCipherKeyLenMax })
        ),
        'Key: ',
        React.createElement('input', { id: 'vigenereCipherKey', onChange: this.updateVigenereCipherKey, value: this.state.vigenereCipherKey, disabled: true }),
        'Key length: ',
        React.createElement('input', { id: 'vigenereCipherKeyLen', onChange: this.updateVigenereCipherKey, value: this.state.vigenereCipherKeyLen, disabled: true }),
        React.createElement('div', { id: 'vigenereCipherKeyDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } }),
        React.createElement('br', null),
        'Result: ',
        React.createElement('textarea', { id: 'vigenereCipherResult', value: this.state.vigenereCipherResult, style: { width: '90%', height: '50px' }, readOnly: true }),
        React.createElement('br', null)
      ),
      React.createElement(
        'div',
        { id: 'columnarTranspositionDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } },
        React.createElement(
          'h3',
          null,
          'Columnar Transposition'
        ),
        'Columns: ',
        React.createElement('input', { id: 'columnarTranspositionColumns', onChange: this.updateColumnarTranspositionColumns, value: this.state.columnarTranspositionColumns }),
        React.createElement('br', null),
        React.createElement(
          'button',
          { onClick: this.columnarTranspositionAllResults },
          'Show all results(careful!)'
        ),
        React.createElement(
          'button',
          { onClick: this.columnarTranspositionGuess },
          'Use quadgram to guess'
        ),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement(
          'span',
          { style: { float: 'left' } },
          ' Result: '
        ),
        React.createElement('textarea', { id: 'columnarTranspositionResult', readOnly: true, style: { width: '90%', height: '50px' } }),
        React.createElement('br', null),
        'Drag textarea to move the transposition, then drop it at where you want it to be.',
        React.createElement('br', null),
        'Change height of columns by changing the height of the uneditable textarea.',
        React.createElement('br', null),
        React.createElement(
          'div',
          { onMouseDown: this.columnarTranspositionDrag, onDragEnd: this.columnarTranspositionDrag, onDrag: this.columnarTranspositionDrag, onMouseMove: this.columnarTranspositionResize, id: 'columnarTranspositionSubDiv', style: { height: '210px', width: '90%' } },
          React.createElement('textarea', { id: 'columnarTranspositionResize', placeholder: 'AInoob', style: { float: 'left', width: '16px', height: '200px', overflow: 'hidden', resize: 'vertical', marginLeft: '5px', border: '1px solid blue', fontSize: '15px' }, disabled: true })
        ),
        React.createElement('br', null),
        React.createElement('div', { id: 'columnarTranspositionAllResults' })
      ),
      React.createElement(
        'div',
        { id: 'keywordCipherDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } },
        React.createElement(
          'h3',
          null,
          'Keyword Cipher'
        ),
        'Action: ',
        React.createElement(
          'select',
          { onChange: this.updateKeywordCipherAction },
          React.createElement(
            'option',
            { value: 'encipher' },
            'Encipher'
          ),
          React.createElement(
            'option',
            { value: 'decipher' },
            'Decipher'
          )
        ),
        '     keyword(lower case): ',
        React.createElement('input', { id: 'keywordCipher', onChange: this.keywordCipher }),
        '    ',
        React.createElement('br', null),
        'Result: ',
        React.createElement('textarea', { id: 'keywordCipherResult', style: { width: '90%', height: '50px' } }),
        React.createElement('br', null)
      ),
      React.createElement(
        'div',
        { id: 'indexOfCoincDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } },
        React.createElement(
          'h3',
          null,
          'Index of Coincidence Analysis'
        ),
        'Max key length: ',
        React.createElement('input', { onChange: this.updateIndexOfCoincMaxLen, value: this.state.indexOfCoincMaxLen }),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement('div', { id: 'indexOfCoincSubDiv' })
      ),
      React.createElement(
        'div',
        { id: 'caesarCipherDiv', style: { display: "none", border: "2px solid red", marginTop: 3 } },
        React.createElement(
          'h3',
          null,
          'Caesar Cipher'
        ),
        'Shift Space',
        React.createElement(
          'span',
          { title: 'if the shift space is English, then z shift one more time will be a' },
          '(?)'
        ),
        ':',
        React.createElement(
          'select',
          { value: this.state.caesarCipherShiftLang, onChange: this.updateCaesarCipherShiftLang },
          React.createElement(
            'option',
            { value: 'English' },
            'English'
          ),
          React.createElement(
            'option',
            { value: 'Latin' },
            'Latin'
          ),
          React.createElement(
            'option',
            { value: 'French' },
            'French'
          ),
          React.createElement(
            'option',
            { value: 'German' },
            'German'
          ),
          React.createElement(
            'option',
            { value: 'Spanish' },
            'Spanish'
          ),
          React.createElement(
            'option',
            { value: 'Portuguese' },
            'Portuguese'
          ),
          React.createElement(
            'option',
            { value: 'Esperanto' },
            'Esperanto'
          ),
          React.createElement(
            'option',
            { value: 'Italian' },
            'Italian'
          ),
          React.createElement(
            'option',
            { value: 'Turkish' },
            'Turkish'
          ),
          React.createElement(
            'option',
            { value: 'Swedish' },
            'Swedish'
          ),
          React.createElement(
            'option',
            { value: 'Polish' },
            'Polish'
          ),
          React.createElement(
            'option',
            { value: 'Dutch' },
            'Dutch'
          ),
          React.createElement(
            'option',
            { value: 'Danish' },
            'Danish'
          ),
          React.createElement(
            'option',
            { value: 'Icelandic' },
            'Icelandic'
          ),
          React.createElement(
            'option',
            { value: 'Finnish' },
            'Finnish'
          ),
          React.createElement(
            'option',
            { value: 'Czech' },
            'Czech'
          )
        ),
        React.createElement('div', { id: 'caesarCipherSubDiv' })
      )
    );
  }
});

ReactDOM.render(React.createElement(Crypter, null), document.getElementById('crypterDiv'));