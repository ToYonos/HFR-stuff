// mod r21 :
// 0.1.1 (25/09/14)
// compatibilité avec le module d'auto-update de toyo
// correction d'un bug sur la detection du header
// et ajout d'un espace esthétique dans l'interface

// CONSTANTES
var PLUGIN_NAME = 'POST_MANAGER';
var POST_NAME_LENTH = 21; // Nombre de char maximum pour le nom d'un post

/**
 * Images utilisées
 */
var Image = {
  minus : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAA' +
  'ABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOdJ' +
  'REFUeNrs2M8KgkAQBvAZlaiTh4igniWix+gR8kV6BM89ifQueQiio5qObTuXCBS' +
  'ETjvwfbD+uc3P2dVFds6R5URkPAAAAAAAAAAAAAAAAADA30l+b4r99uxPJz/SgG' +
  'vO/cgO13II0OJ3x02arOdEHGDpz5aKy00fcDbaAc2jrCi+1zankOb96omE7QK6R' +
  'iiKDQOk6Sky9G4adqDqbAOkFuKgZ1A83QHTAF0DTM7yIhZ/DBgwmwD0+h1whgHS' +
  'Bg7Q2pgX/qoeA+RuubKwmfvudRi/1wEAAAAAAAAAAAAAAAAAq/kIMABbK0GsZHl' +
  '5+AAAAABJRU5ErkJggg==',

  disabledMinus : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADAAA' +
  'AAwCAQAAAD9CzEMAAAAAXNSR0IArs4c6QAAAAJiS0dEAP+Hj8y/AAAACXBIWXMA' +
  'AAsTAAALEwEAmpwYAAAAB3RJTUUH2gMVFSg0ORJzEAAAAJdJREFUWMPt1bENwkA' +
  'MheHfQIMQyib0jASDhBGyQgZhggyCoECRLohQpLhItH7dc3PdfXp3sh0z2tpgwI' +
  'ABAwYMwG452hsXmtSbu+HaA7FstPZ5bo5E2u1v7gzR1wTw4KV8Ivjw1QKT6L9XQ' +
  'GiBok5Q1AkmbaNBUQPZCbb/fTCrgew67Rkr0B3yh91IHXZeOAYMGDBgQFs/rOMe' +
  '0ygqn0gAAAAASUVORK5CYII=',

  plus : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAA' +
  'BXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAe9JR' +
  'EFUeNrsWsFKw0AQnS1JbS1a9Sr0b+rRm56U3oT26K1f4N1DcxAPRU+K50Lx4pco' +
  'BUEQMW0NbZNm192YQqMVstuU7GgGhkkg252XN7M7sylhjAFmyQFyQQ/AmL/Za+S' +
  'lf+DgqAa31+0Wv6xLDrUOj2uNm6u2kuPdlvsTgIqEOVQ/OW3AxnYh1hinP4HL84' +
  's6d77Jb/uJMaAGgAb27WUQqMTA5ENIRShlEZtqDizDwMyiA4CfAUojFiEDNGJjA' +
  '8cOQCMG/Ij9NyGUVAylGEIsC6FkAPg0YtMup8+42iG/sfThvhvEgrlGAhbiqHgW' +
  'SDCf1FyhtuYdJvMdGS+n7ep+tby5sw6ExH8LY2cKow8PRo4X6/liyYRCyeBqSs3' +
  'jDFzo3HUCv38tp+1XB4bvk5XS7gx9rivKAV+sJn46CZkIABGjMrTqB4CvJgQIXg' +
  'A+ovD5qyGEngGxoxLsAAB3EmM6LzUWV5f6AiB8heEvuMgvR4sAWL3HJ3FEWJaqC' +
  'HM52K1UpBx57vVUw9WaOb8IQDNUGRFgbcV+YAvSPlqc9Vay/YA2pxJf3jD5jkyX' +
  's9G0l98MwPfmPmMgA6C6EOFngGEGwBS+0Gi0D4g9SZYBxnTLAazfyMy80ffcqeV' +
  'OPOkP3eHY5crr7M8eGYDl5FOAAQCMSz5OagVIpQAAAABJRU5ErkJggg==',

  validate : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCA' +
  'YAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgS' +
  'W1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNCqoZUJ+ro' +
  'KUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9t' +
  'rCwAI/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1' +
  'bottSo8BTZviVWrEh546EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5' +
  'VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+z' +
  'g91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWANyRYlU4Y9Br6oHd5bDh0' +
  'bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1OUqcwp' +
  'dC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7' +
  'sgoHDfDaAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCw' +
  'ngvM2Rm/ugUCi84fycr4l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC',

  disabledValidate : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAD' +
  'AAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY' +
  '0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAJiS0dE' +
  'AACqjSMyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAACXZwQWcAAAAwAAAAMADO7ox' +
  'XAAADj0lEQVRYw+2Xy2sbVxSHv3l4Kkup06YY2rSEuo5qWndaSmiKs2yXhayyyj' +
  'YQEMjIyHiQsSkUUmwcDAYVB5cUCiWrrLzpH1KTtjaugt2gJjEWdixp9Lr3diFhR' +
  'taMHpaz87kbPa6+3zm/OfchTfF6Q3/N/HOBzmHC730BHh2/skcY3Pjz5LdnVoE9' +
  'F8kMPbG/97FI9TUa+FTk3rd8w4Uf7LkWAdnXaOAXblCjwg0i9+zUGQvYqfDCBDp' +
  'FimhMMLhgJ8/MIrBnwgsTGJSQSEoYTBBatuMeAXHqIflrJrT0NTpFBBKJoIjBda' +
  'y0HevbIsVWshlfl3AZ4DrWqn2nLwHFdjK0/BUGLrLJtrqEjfnQvggmiFN0vcZOI' +
  'rR8DZ0ifvtxEYlJbZhDk0ar9YbfTYRWvmw8Wr+o8jel+Y3tlgo0sleI8eDyrmqD' +
  'zybeWPmiYY5fVNiiPL/xY0sXSbLf6TvRlLmTvSMDOycbt1Y+R6dIzffplD148Fi' +
  'k8fKmvj7OMEP88fCFMfyz8sn+ZdxKf4ZBCRWQ/T8evMcijdxNY32MMAeYjPNkbY' +
  '9LJyQ0cnErPd7GnCoZKh78sUWS3C1jPUqEImVcTD7BWsvFZZM5uZiV/hSDUqA5J' +
  '/GNCjTyt4zHUcIUkdRXhsUYm+lDLvykGtnnYwOrY2gBjQlVdqnMbiw2f6qDJH/b' +
  'eHyVEO5xZjVcNKJY6XxCIpDk7w6sRtFxPavWOyq+eNDBva0/GsXy4OtLvoTGKNa' +
  'Km1S4d821UYxAfJl/ffFgArH3UBR9inax+IjMctkwl0bQfefUzfmPqi++fuj/8o' +
  'pqQNeXUIwQXvqwYY7fqLTBgwnVX4+uyfilgOwEFu9D4KYgeUEtEN/oIjEJKv52w' +
  'BSX4BDsIdrgjxdaYRJU/CIavYRgvwPes1UcTSJUohcJQa4jvmk3PZh6C5UY6hIv' +
  'OUDMHix2mte0Xe9PvcNh4s2u8K8Qzv79zjNPHDh7U8PiKBnpYJTkCOHsdYH3OTK' +
  'fT7+LSobbSEgKCOd5V/iWCgCy05cpJMMBP1AUkE62S7yvADyb/oBCctCnComLdJ' +
  '51jQ8QgN3pK8KdCbVkX0I6uz3g21xbnjojopQa8FShKKOcpz3h295NM7NiseJ5X' +
  '0Y5mfv+1/eeLarH9uxVUZkz0VBUUc52j9l3FICt+Y+pzhkIlLN1CjyYdChzc35s' +
  'sxbjweZvp8GDdv5P/1yg7/gf2cTMRiymop4AAAAASUVORK5CYII=',

  cancel : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYA' +
  'AAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1' +
  'hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBi' +
  'itDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769' +
  'qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVf' +
  'gNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlv' +
  'j5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65Whbmrn' +
  'ZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h' +
  '+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/' +
  'vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6' +
  'y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBa' +
  'DN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJN' +
  'ZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskw' +
  'rVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2' +
  '+FAAAAABJRU5ErkJggg==',

  close : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAA' +
  'AD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQ' +
  'TFRFBAcHFBcX7+/v0NDQMzY2oaKiYmRkwMHBQ0VFgYODIyYm4ODgU1VVsLGxcnR' +
  '0kZKS////hYi7ewAAABF0Uk5T/////////////////////wAlrZliAAADS0lEQV' +
  'R42uya627kIAyFDQQIuczM+z9tZ9XtquoYfGxIRyvh3yjnU+IY3+jxZqMJMAEmw' +
  'ASYABNgAkyA/xbA51hKWp92lBLz/qsAoRyOfphbS/4dgDO9iP+zI/qLAUJD/dNS' +
  'vhAgrwTYFi8CwOS1CDDADsv/sSWPBiiktORHAoSF1ObyOIDoyGJlFEAio61+BIB' +
  'fyWzL3g/gF+owF3oB+vQBArpWXyagi/WfBL4DINEAW7wZoNAQS1aATIPsbgPwbh' +
  'QABRPAwX5QiYo9sFgAMu9QwQkexx4oBoCt4tBNguqBXQ1Qqj9Ug6B+4NACcB749' +
  'UNXCVoHshKgtAJKhaB5YNUBMC/ge0BjCYQDQQVwFwJqcOoDSQWwSQH9RUA8QF4B' +
  'kOVo+kPg9cY5sIBM6C0YmwSv+gkMhzwA52MtAkS/EowIvwbrBJg+/w1YgBupCEB' +
  '9PhSwALVEjCdA9YlQAF+N9RwBrs+GY9JlQq8EK67PXsqkTAXlyr+RyB4gQDMXjn' +
  'Z91gs5gHYxGDsSeRBgIzOBUEiAAFKOG82FTB4DUCUQC6lRABUCuZDDAJCCKNoKy' +
  'XEAdKIXyEUATMUb3CiAh0kfIhgFUKn4ZYJBANWOg0gAAjhzx0Mi8CPugmbHRSAY' +
  'cRu2Oz5C7TwgH1ik7muL4OjPiF71g4IAzYi8Qj8JFYspJ6xmxXz+iRP4zrqglv+' +
  'iBAtcF5wqfZig9NWGrfwfIwhd1XG7/kAINkV1fCr1IYLS1SHJ0kuKYjjbNQBFmj' +
  'skKUuLYKew1iUTJh9JyhMj2igkOMP+TpCkTDX29gkfu2sQJClXjv2dUu5K/CJIU' +
  'rYeCX4BdQCuWfxJkKR6IWpGFvV2/VmZwSWpYuH0b5aJycoSSPVP5PQ3bwHYx82M' +
  'sm1qdo7SL9a54W2M/mqfnK4j9Df75HTM7Dh0Tc+3907PsaL7yv2B58/45g2KPj+' +
  'Q9ZEtGn9cszmAr/FY9wigZSpskyobfgaHbbSBu2ReHRRXcMkT3qbLKl/cTvS5in' +
  '3CCH8HV/DNTtVGJYagkVfvlJ7iL7lE3RPVW7X+3rgil7t6v9iyV+zPG+ORS4qW7' +
  'WbzZnU4S1n/2q3EbH3OXG6fABNgAkyACTABJsAEeDvAhwADADvfuU5RlpADAAAA' +
  'AElFTkSuQmCC',

  save : 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAA' +
  'Af8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALE' +
  'wAACxMBAJqcGAAAAAd0SU1FB9oDHhEqIMH26jIAAAIdSURBVDjLrZI7a1VBFIW/' +
  'PWfuvUlEg4+kuGBELUQQEUExivgDtPRfWGqhpWArgiBipYWN4h8QfNU+KgVFMWh' +
  'E1ARNck1u7jlzZi+LE/OodVWLmc3HzFob/lEGcPTco/ObhuKB7DoJdEEdkMmb+1' +
  'gEzMDdqyLwrUz19TLVN17cPF1GgJFOcezWheNni2DsGY/0+jVD7YLsKAazVgSBe' +
  'n21v/5c3nXv6aerT159GQMuBYDsOj73u+bx6x4A1x685d10j6VBtqrOLFfOzEJi' +
  'bqli6seA05M7acV4ESACCLbKwBBZzb+yoBUhFsagEsulmxl8/F4iibKqtQoAdWo' +
  'XYJQ1nDkxwcT4JkZHIgL6lROLQIxGuzDmFytJbmsAYch4Pz3P5dufiEWgFQMxQM' +
  'qiSo6rGUwMc3DPZlNzsAZwz5JFK4Z3ICAhEiIbeHQkkd2RjJRqkAMQ/vaZc1NZw' +
  'BpjhstYsYA1w8qklJEy60Mk5UynZYyPtkABEC4hdwS4O/LMzMKAQVUh9zWAIVIt' +
  '9nVHOHuqYnpuimBhw75JmYltu7n7sGD21xzSeoAZ2ZEUbGr2M8+nn1GE1oaVzZ5' +
  'INeS6S5Vqsb4FIdwddyhzn145SwztDYDaE5X3yVkrGax7gcTMUDuM75+IHO5Oau' +
  '/YfluJclVCjLa268OWr8z+lAGLq4BU+/0rd14eknQkmDqoqU3KNN6b2iRLdUby5' +
  'Sze8D/0BzbZRSMrSAkGAAAAAElFTkSuQmCC'
};

/**
 * Css du plugin
 */
var css = {

  /**
   * Charge le CSS utilisé par les popups modales de la page
   */
  loadModalePopupCss : function() {

    GM_addStyle
      (
        '.' + PLUGIN_NAME + '_opacity' +
        '{' +
        ' opacity: 0.75;' +
        ' left: 0px;' +
        ' top: 0px;' +
        ' position: fixed;' +
        ' z-index: 99;' +
        ' width: 100%;' +
        ' height: 100%;' +
        ' background-color: black;' +
        '}' +

        '.' + PLUGIN_NAME + '_modalePopup' +
        '{' +
        ' display: table;' +
        ' left: 0px;' +
        ' top: 0px;' +
        ' position: fixed;' +
        ' z-index: 100;' +
        ' width: 100%;' +
        ' height: 100%;' +
        ' text-align: center;' +
        '}'+

        '.' + PLUGIN_NAME + '_modalePopup > div' +
        '{' +
        ' display: table-cell;' +
        ' vertical-align: middle;' +
        '}' +

        '.' + PLUGIN_NAME + '_modalePopup > div > div' +
        '{' +
        ' overflow: auto;' +
        ' background-color: white;' +
        ' border-color: black;' +
        ' border-width: 1px;' +
        ' border-style: solid;' +
        ' margin-right: auto;' +
        ' margin-left: auto;' +
        '}'
        );
  },

  /**
   * Charge le css utilisé par les popups de la page.
   */
  loadPopupCss : function() {

    GM_addStyle
      (
        '.' + PLUGIN_NAME + '_popup' +
        '{' +
        ' z-index: 50;' +
        ' position: absolute;' +
        ' overflow: auto;' +
        ' background-color: white;' +
        ' border-color: black;' +
        ' border-width: 1px;' +
        ' border-style: solid;' +
        '}'
        );
  },

  /**
   * Charge le css utilisé par la popup de gestion des posts.
   */
  loadPostManagerCss : function() {

    GM_addStyle
      (
        /* BODY */
        '.' + PLUGIN_NAME + '_managePostBody' +
        '{' +
        ' display: table;' +
        ' width: 99%;' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostBody > div' +
        '{' +
        ' display: table-row;' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostBody > div > div' +
        '{' +
        ' display: table-cell; ' +
        ' padding: 5px;' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostBody > div > div:first-child ' +
        '{' +
        ' width: 150px; ' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostBody > div > div:first-child > input' +
        '{' +
        ' display: block; ' +
        ' font-size:0.7em; ' +
        ' height: 16px;' +
        ' width: 150px;' +
        ' margin-bottom: 8px;' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostBody > div > div:first-child > select' +
        '{' +
        ' display: block; ' +
        ' width: 100%; ' +
        ' height: 170px;' +
        ' font-size:0.7em; ' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostBody > div > div:last-child > textarea' +
        '{' +
        ' width: 100%; ' +
        ' height: 200px;' +
        '}' +

        /* Barre de titre */

        '.' + PLUGIN_NAME + '_managePostTitleBar' +
        '{' +
        ' text-align: right;' +
        '}' +

        '.' + PLUGIN_NAME + '_managePostTitleBar > input' +
        '{' +
        ' margin: 2px;' +
        ' height:20px;' +
        '}' +

        /* Boutons */

        '.' + PLUGIN_NAME + '_managePostButtons' +
        '{' +
        ' margin-top: 20px;' +
        '}'+

        '.' + PLUGIN_NAME + '_managePostButtons > div' +
        '{' +
        ' display:inline;' +
        '}'+

        '.' + PLUGIN_NAME + '_managePostButtons > div:first-child ' +
        '{' +
        ' float: left;' +
        ' margin-bottom: 10px;' +
        '}'+

        '.' + PLUGIN_NAME + '_managePostButtons > div:last-child' +
        '{' +
        ' float: right;' +
        ' margin-bottom: 10px;' +
        '}'+

        '.' + PLUGIN_NAME + '_managePostButtons > div > button > img' +
        '{' +
        ' max-height: 16px;' +
        ' max-width: 16px;' +
        ' margin-bottom: -3px;' +
        ' margin-right: 3px;' +
        '}'+

        '.' + PLUGIN_NAME + '_managePostButtons > div > button' +
        '{' +
        ' background-color: #f5f5f5;' +
        ' font-family: "Lucida Grande", Tahoma, Arial, Verdana, sans-serif;' +
        ' font-size: 0.8em;' +
        ' cursor: pointer;' +
        ' border-right: 1px solid #dedede;' +
        ' border-bottom: 1px solid #dedede;' +
        ' border-top: 1px solid #eee;' +
        ' border-left: 1px solid #eee;' +
        ' padding: 2px 2px 2px 2px;' +
        ' margin-right: 4px;' +
        ' margin-left: 4px;' +
        '}'
        );
  },

  /**
   * Charge le css utilisé par la popup de sauvegarde des posts.
   */
  loadSavePostCss : function() {

    GM_addStyle
      (
        '.' + PLUGIN_NAME + '_savePost > input[type="text"]' +
        '{' +
        ' height: 14px;' +
        ' margin: 5px;' +
        ' font-size: 0.7em;'  +
        '}' +

        '.' + PLUGIN_NAME + '_savePost > input[type="image"]' +
        '{' +
        ' max-height: 16px;' +
        ' max-width: 16px;' +
        ' margin: 5px;' +
        ' vertical-align: middle;' +
        '}' +

        '.left > a' +
        '{' +
        ' cursor: pointer;' +
        '}' +

        '.left > a > img' +
        '{' +
        ' max-height: 16px;' +
        '}'
        );
  },

  /**
   * Charge le css utilisé par les vues d'ajout de posts dans la zone
   * de réponse.
   *
   * \param isInEditor
   *    true si le css à charger doit être celui de la vue éditeur,
   *    false si il doit être celui de la zone de réponse rapide.
   */
  loadSelectPostCss : function(isInEditor) {

    if(isInEditor) {
      GM_addStyle
        (
          '#content_form' + // textarea
          '{' +
          ' width: 80% !important;' +
          '}' +

          '.' + PLUGIN_NAME + '_buttonPost' +
          '{' +
          ' margin-left: 81.5%;' +  // Comme le textarea
          '}' +

          '.' + PLUGIN_NAME + '_selectPost' +
          '{' +
          ' width: 18%;' +
          ' height: 254px;' +
          ' margin-left: 1%;' +
          ' margin-bottom: 2px;' +
          ' font-family: Verdana,Arial,Sans-serif,Helvetica;' +
          '}'
          );
    }
    else {
      GM_addStyle
        (
          '.s2Ext > b:first-child' +  // Le titre du textarea
          '{' +
          ' margin-left: 200px;' +
          ' margin-right: 200px;' +
          '}' +

          '.' + PLUGIN_NAME + '_selectPost' +
          '{' +
          ' width: 150px;' +
          ' height: 104px;' +
          ' margin-bottom: 2px;' +
          ' margin-left: 5px;' +
          ' font-family: Verdana,Arial,Sans-serif,Helvetica;' +
          '}'
          );
    }
  }
};

/**
 * Fonctions de gestion des posts.
 */
var post = {

  /**
   * Crée et initialise un objet post.
   *
   * \param name
   *    Le nom du post.
   * \param value
   *    La valeur du post.
   */
  Post : function(name, value) {
    this.name = name;
    this.value = value;
  },

  /**
   * Retourne un boolean indiquant si un post peut être sauvegardé.
   *
   * \param
   *    Le post que l'on veut tester.
   *
   * \return true si le post peut être sauvegardé, false sinon.
   */
  canSavePost : function(post) {
    return typeof post.name != undefined && tools.trim(post.name) != '';
  },

  /**
   * Sauvegarde un post.
   *
   * \param post
   *    Le post à sauvegarder.
   */
  savePost : function(post) {

    if(this.canSavePost(post)) {
      GM_setValue(PLUGIN_NAME + '_' + tools.trim(post.name), post.value);
    }
    else {
      throw new Error(0, 'Impossible de sauvegarder le post.');
    }
  },

  /**
   * Supprime les posts sauvegardés.
   */
  deletePosts : function() {

    var keys = GM_listValues();
    for (var i=0, key=null; key=keys[i]; i++) {
      GM_deleteValue(key);
    }
  },

  /**
   * Lit et retourne un tableau des posts sauvegardés.
   *
   * \return  Le tableau de posts lus.
   */
  readPosts : function() {

    var name = '';
    var value = '';
    var arrayPosts = new Array();
    var names = GM_listValues();

    for(var i = 0; i < names.length; i++) {
      name = names[i];
      if(name.substring(0, PLUGIN_NAME.length) == PLUGIN_NAME){
        value = GM_getValue(names[i]);
        name = name.substring(PLUGIN_NAME.length + 1, name.length);
        arrayPosts.push(new this.Post(name, value));
      }
    }

    return arrayPosts;
  }
};


/**
 * Fonctions utilitaires.
 */
var tools = {

  /**
   * Supprime tout caractère blanc (espace, retour chariot, tabulation,
   * saut de ligne, saut de page) au début et à la fin d'une chaîne de
   * caractères.
   *
   * \param trimString
   *    La chaîne de caractères à traiter.
   *
   * \return La chaîne traitée.
   */
  trim : function(trimString) {

    if(typeof trimString.trim == 'undefined') {
      return trimString.replace(/^\s+/g,'').replace(/\s+$/g,'');
    }
    else {
      return trimString.trim();
    }
  },

  /**
   * Ajoute un élément à la fin de la barre d'outils principale du forum.
   * \param element
   *     L'élément à ajouter dans la barre d'outils.
   */
  addElementInHeaderToolbar : function(element) {

    var divHeader = document.getElementsByClassName('header')[0].nextSibling.nextSibling;
    var divLeftHeader = divHeader.getElementsByTagName('td')[0];
    divLeftHeader.appendChild(document.createTextNode(' | '));
    divLeftHeader.appendChild(element);
  },

  /**
   * Fonction permettant de créer un bouton associé à une image.
   *
   * \param name
   *     Le nom du boutton.
   * \param listenerButton
   *     Ecouteur sur le clic du bouton.
   * \param src
   *     Source de l'image. Si null ou non définit le bouton n'aura pas d'image.
   *
   * \return Le bouton créé et initialisé.
   */
  createButton : function(name, listenerButton, src) {

    var button = document.createElement('button');
    var img = null;

    if(typeof src != 'undefined' && src != null) {
      img = document.createElement('img');
      img.setAttribute('src', src);
      img.setAttribute('alt', name);
      button.appendChild(img);
    }

    button.setAttribute('type', 'button');
    button.addEventListener('click', listenerButton, false);
    button.appendChild(document.createTextNode(name));

    return button;
  },

  /**
   * Charge une page en AJAX.
   *
   * \param url
   *    Url à charger.
   * \param type
   *    Type de requête à effectuer POST ou GET
   * \param arguments
   *    Arguments à envoyer ou null si il n'y en a pas.
   * \param successHandler
   *    Fonction appellée en cas de réussite du chargement de la page,
   *    prend en paramètre la requête XMLHttpRequest envoyé.
   * \param errorHandler
   *    Fonction appellée en cas d'erreur de chargement de la page.
   *    Si non-renseignée une popup d'erreur s'affiche.
   */
  loadPage : function(url, type, arguments, successHandler, errorHandler) {

    var xmLHttpRequest = new XMLHttpRequest();

    // handler par défaut en cas d'erreur
    if(typeof errorHandler == 'undefined') {
      errorHandler = function() {
        alert("Erreur de chargement AJAX" + req.statusText);
      }
        }

    xmLHttpRequest.onreadystatechange = function() {

      // réponse chargée
      if(xmLHttpRequest.readyState == 4) {
        // Code http OK
        if(xmLHttpRequest.status == 200) {
          successHandler(xmLHttpRequest);
        }
        else {
          errorHandler(xmLHttpRequest);
        }
      }
    };

    if(type.toUpperCase() == 'GET') {
      url += (arguments != null) ? '?' + arguments : "";
      xmLHttpRequest.open('GET', url,  true);
      xmLHttpRequest.send(null);
    }
    else {
      // TODO Implémenter POST
    }
  }
}

/**
 * Crée et initialise un objet popup dans la page.
 *
 * \param id
 *     L'identifiant de la popup à afficher.
 */
function Popup(id) {

  if(typeof Popup.initialized == "undefined") {

    /**
     * Affiche une popup dans la fenêtre.
     *
     * \param x
     *    Le positionnement en x de la popup.
     * \param y
     *    Le positionnement en y de la popup.
     * \param width
     *    La largeur de la popup. Si non défini ou null la popup
     *    s'ajustera automatiquement au contenu
     * \param height
     *    La hauteur de la popup. Si non défini ou null la popup
     *    s'ajustera automatiquement au contenu
     */
    Popup.prototype.display = function(x, y, width, height) {

      var divPopup = document.createElement('div');
      divPopup.setAttribute('class', PLUGIN_NAME + '_popup');
      divPopup.id = id;
      divPopup.style.left = x;
      divPopup.style.top = y;

      if(typeof width != 'undefined' && width != null) {
        divPopup.style.width = width;
      }
      if(typeof height != 'undefined' && height != null) {
        divPopup.style.height = height;
      }
      document.body.appendChild(divPopup);
      this.paint(divPopup);
    }

      /**
       * Retourne une fonction de fermeture de la popup.
       *
       * \return Une fonction de fermeture de la popup.
       */
      Popup.prototype.getClose = function() {
        return function() {
          var popupNode = document.getElementById(id);
          popupNode.parentNode.removeChild(popupNode);
        }
          };

    Popup.initialized = true;
  }
}


/**
 * Crée et initialise un objet popup modale dans la page. L'objet et la
 * fonction paint() doivent être sous-classé pour être utilisé.
 *
 * \param id
 *    L'identifiant référençant la popup à afficher.
 */
function ModalePopup(id) {

  if(typeof ModalePopup.initialized == "undefined") {

    /**
     * Affiche une popup modale au centre de la fenêtre.
     *
     * \param width
     *    La largeur de la popup. Si null ou non définit aucune
     *    largeur ne sera attribuée.
     * \param height
     *    La hauteur de la popup. Si null ou non définit aucune
     *    hauteur ne sera attribuée.
     */
    ModalePopup.prototype.display = function(width, height) {

      var divOpacity = document.createElement('div');   // Affiche l'effet d'opacité du fond
      var divTable = document.createElement('div');   // Div recouvrant toute la page
      var divCell = document.createElement('div');    // div centrée horizontalement
      var divPopup = document.createElement('div');   // div popup centrée verticalement

      divOpacity.id = 'opacity_' + id;
      divOpacity.setAttribute('class', PLUGIN_NAME + '_opacity');

      divTable.id = id;
      divTable.setAttribute('class', PLUGIN_NAME + '_modalePopup');

      if(typeof height != 'undefined' && height != null) {
        divPopup.style.height = height;
      }

      if(typeof width != 'undefined' && width != null) {
        divPopup.style.width = width;
      }

      divCell.appendChild(divPopup);
      divTable.appendChild(divCell);

      document.body.appendChild(divTable);
      document.body.appendChild(divOpacity);

      // Appel de la fonction ajoutant le contenu et devant
      // être redéfinie dans la classe héritante
      this.paint(divPopup);
    };

    /**
     * Retourne une fonction de fermeture de la popup modale.
     *
     * \return Une fonction de fermeture de la popup modale
     */
    ModalePopup.prototype.getClose = function() {
      return function() {
        var divTable = document.getElementById(id);
        divTable.parentNode.removeChild(divTable);

        var divOpacity = document.getElementById('opacity_' + id);
        divOpacity.parentNode.removeChild(divOpacity);
      }
        };

    ModalePopup.initialized = true;
  }
}

/**
 * Objet popup permettant de créer, supprimer, modifier les posts.
 *
 * \param id
 *    Id utilisé par la popup à afficher.
 */
function PostManager(id) {

  ModalePopup.call(this, id);

  if (typeof PostManager.initialized == "undefined") {

    for (var element in ModalePopup.prototype ) {
      PostManager.prototype[element] = ModalePopup.prototype[element]
        }
    PostManager.initialized = true;
  }

  /**
   * Initialise le contenu de la popup modale.
   *
   * \param popup
   *    L'élément html dans lequel le contenu sera ajouté.
   */
  this.paint = function(popup) {

    var posts = post.readPosts(); // Posts à afficher
    var inputName = document.createElement('input');
    var select = document.createElement('select');
    var textarea = document.createElement('textarea');
    var buttonNew, buttonValidate, buttonDelete, buttonCancel;
    var divTable = document.createElement('div');
    var divRow = document.createElement('div');
    var divCellLeft = document.createElement('div');
    var divCellRight = document.createElement('div');
    var divTitleBar = document.createElement('div');
    var divButtons = document.createElement('div');
    var divLeftButtons = document.createElement('div');
    var divRightButtons = document.createElement('div');

    var inputClose = document.createElement('input');
    var oldSelectedIndex = -1;  // dernier index sélectionné dans le select

    /**
     * Fonction de gestion de séléction/désélection des options dans la
     * liste des noms de posts.
     */
    function manageSelectOption() {

      // Une ancienne valeur a été sélectionnée avant
      if(oldSelectedIndex >= 0) {
        var optionOld = select.options[oldSelectedIndex];
        // L'ancienne valeur existe encore
        if(typeof optionOld != 'undefined') {
          // Sauvegarde des modfications dans l'interface
          optionOld.value = textarea.value;
          optionOld.firstChild.textContent = inputName.value;
        }
      }

      // Une option est sélectionnée
      if(select.selectedIndex != -1) {

        // Ajout du contenu des inputs
        var optionSelected = select.options[select.selectedIndex];
        textarea.value = optionSelected.value;
        inputName.value = optionSelected.firstChild.textContent;

        // Activation du bouton supprimer
        buttonDelete.removeAttribute('disabled');
        buttonDelete.firstChild.setAttribute('src', Image.minus);

        // Activation du textArea
        textarea.removeAttribute('disabled');

        oldSelectedIndex = select.selectedIndex;
      }
      else {
        // Suppression du contenu des inputs
        textarea.value = '';
        inputName.value = '';
        oldSelectedIndex = -1;

        // Désactivation du bouton supprimer
        buttonDelete.setAttribute('disabled', 'disabled');
        buttonDelete.firstChild.setAttribute('src', Image.disabledMinus);

        // Désactivation du textArea
        textarea.setAttribute('disabled', 'disabled');
      }
    }

      /**
       * Fonction appelée lorsqu'une sélection est effectuée dans le select.
       */
      function listenerSelect(event) {
        try {
          manageSelectOption();
        }
        catch(exception) {
          alert('name: ' + exception.name + ' exception: ' + exception.message);
        }
      }

      /**
       * Fonction appelée pour supprimer les posts sélectionnés dans le select.
       */
      function listenerButtonDelete(event) {
        try {
          var options = select.childNodes;
          var lastIndexSelected = 0;

          // Suppression
          for(var cpt = options.length - 1; cpt > -1; cpt--) {
            if(options[cpt].selected) {
              select.removeChild(options[cpt]);
              lastIndexSelected = cpt;
            }
          }

          // Sélection de l'item le plus proche du dernier item supprimé
          if(options.length > 0) {
            if(lastIndexSelected > options.length - 1) {
              options[options.length - 1].selected = 'selected';
            }
            else {
              options[lastIndexSelected].selected = 'selected';
            }
          }

          manageSelectOption();
        }
        catch(exception) {
          alert('name: ' + exception.name + 'exception: ' + exception.message);
        }
      }

      /**
       * Fonction appelée pour ajouter un nouveau post dans le select.
       */
      function listenerButtonNew(event) {
        try {
          var newOption = document.createElement('option');
          newOption.value = '';
          newOption.appendChild(document.createTextNode('Nouveau'));
          newOption.selected = 'selected';
          select.appendChild(newOption);
          manageSelectOption();
          inputName.focus();
        }
        catch(exception) {
          alert("name: " + exception.name + "exception: " + exception.message);
        }
      }

      /**
       * Fonction appelée pour sauvegarder et quitter la popup.
       */
      function listenerSaveAndQuit(event) {
        try {
          manageSelectOption(); // Sauvegarde des post dans le select
          var options = select.childNodes;
          post.deletePosts();   // Suppression des posts

          // Sauvegarde des posts
          for(var cpt = 0; cpt < options.length; cpt++) {
            post.savePost(
              new post.Post(options[cpt].firstChild.textContent, options[cpt].value)
              );
          }
          listenerClose(event);
        }
        catch(exception) {
          alert("name: " + exception.name + "exception: " + exception.message + ' stackTrace; ' + exception.stack);
        }
      }

      /**
       * Fonction utilisée pour fermer la popup.
       */
      function listenerClose(event) {
        try {
          // Touche Echapp ou click de bouton
          if(event.keyCode == 27 || typeof event.keyCode == 'undefined') {
            window.removeEventListener('keydown', listenerClose, false);
            PostManager.prototype.getClose()();
          }
        }
        catch(exception) {
          alert("name: " + exception.name + "exception: " + exception.message);
        }
      }

      // Construction de la popup

      buttonNew = tools.createButton('Nouveau', listenerButtonNew, Image.plus);
    buttonValidate = tools.createButton('Enregistrer et fermer', listenerSaveAndQuit, Image.validate);
    buttonDelete = tools.createButton('Supprimer', listenerButtonDelete, Image.minus);
    buttonCancel = tools.createButton('Annuler', listenerClose, Image.cancel);

    inputClose.setAttribute('type', 'image');
    inputClose.setAttribute('alt', 'Fermer');
    inputClose.setAttribute('src', Image.close);
    inputClose.addEventListener('click', listenerClose, false);

    inputName.setAttribute('type', 'text');
    inputName.setAttribute('maxlength', POST_NAME_LENTH);

    select.setAttribute('multiple', 'multiple');
    select.addEventListener('change', listenerSelect, false);

    for (var i = 0; i < posts.length; i++) {
      var option = select.appendChild(document.createElement('option'));
      option.setAttribute('value', posts[i].value);
      option.appendChild(document.createTextNode(posts[i].name));
    }

    textarea.setAttribute('rows', '12');
    textarea.setAttribute('cols', '70');

    divButtons.setAttribute('class', PLUGIN_NAME + '_managePostButtons');
    divTable.setAttribute('class', PLUGIN_NAME + '_managePostBody');
    divTitleBar.setAttribute('class', PLUGIN_NAME + '_managePostTitleBar');

    window.addEventListener('keydown', listenerClose, false); // Ecouteur sur la touche Echapp

    manageSelectOption();

    divTitleBar.appendChild(inputClose);

    divCellRight.appendChild(textarea);

    divCellLeft.appendChild(inputName);
    divCellLeft.appendChild(select);

    divRow.appendChild(divCellLeft);
    divRow.appendChild(divCellRight);

    divTable.appendChild(divRow);

    divLeftButtons.appendChild(buttonNew);
    divLeftButtons.appendChild(buttonDelete);
    divRightButtons.appendChild(buttonValidate);
    divRightButtons.appendChild(buttonCancel);

    divButtons.appendChild(divLeftButtons);
    divButtons.appendChild(divRightButtons);

    popup.appendChild(divTitleBar);
    popup.appendChild(divTable);
    popup.appendChild(divButtons);
  }
    }

/**
 * Popup de sauvegarde d'un post du forum.
 *
 * \param id
 *     Id de la popup à afficher.
 * \param bbCode
 *     BBCode du post à sauvegarder.
 */
function SavePost(id, bbCode) {

  Popup.call(this, id);

  if (typeof SavePost.initialized == "undefined") {
    for (var element in Popup.prototype ) {
      SavePost.prototype[element] = Popup.prototype[element];
    }
    SavePost.initialized = true;
  }

  /**
   * Initialise le contenu de la popup modale.
   *
   * \param popup
   *     L'élément html dans lequel le contenu sera ajouté.
   */
  this.paint = function(popup) {

    var inputText = document.createElement('input');
    var inputClose = document.createElement('input');
    var inputValidate = document.createElement('input');
    var inputValidate = document.createElement('input');

    popup.className += ' ' + PLUGIN_NAME + '_savePost';

    /**
     * Ecouteur du bouton valider.
     */
    function validateListener(event) {
      try {
        if(inputText.value != '') {
          post.savePost(new post.Post(inputText.value, bbCode));
          SavePost.prototype.getClose()();
        }
      }
      catch(exception) {
        alert('name: ' + exception.name + 'exception: ' + exception.message);
      }
    }

      /**
       * Ecouteur sur le champ texte.
       */
      function inputTextListener(event) {
        try {
          if(inputText.value != '') {
            inputValidate.removeAttribute('disabled');
            inputValidate.setAttribute('src', Image.validate);
          }
          else {
            inputValidate.setAttribute('disabled', 'disabled');
            inputValidate.setAttribute('src', Image.disabledValidate);
          }
          // Touche Entrée
          if(event.keyCode == 13) {
            validateListener();
          }
          // Touche Echap
          else if(event.keyCode == 27) {
            SavePost.prototype.getClose()();
          }
        }
        catch(exception) {
          alert('name: ' + exception.name + 'exception: ' + exception.message);
        }
      }

      inputText.setAttribute('type', 'text');
    inputText.setAttribute('maxlength', POST_NAME_LENTH);
    inputText.addEventListener('keyup', inputTextListener, false);
    inputText.addEventListener('blur', inputTextListener, false);

    inputClose.setAttribute('type', 'image');
    inputClose.setAttribute('src', Image.cancel);
    inputClose.addEventListener('click', SavePost.prototype.getClose(), false);

    inputValidate.setAttribute('type', 'image');
    inputValidate.setAttribute('disabled', 'disabled');
    inputValidate.setAttribute('src', Image.disabledValidate);
    inputValidate.addEventListener('click', validateListener, false);

    popup.appendChild(inputText);
    popup.appendChild(inputValidate);
    popup.appendChild(inputClose);

    inputText.focus();
  }
    }

/**
 * Objet permettant de gérer l'ajout de posts dans la zone de sélection.
 *
 * \param inputText
 *     L'input à remplir avec le message sélectionné.
 * \param select
 *     Le select qui contiendra les message pouvant être sélectionnés.
 */
function SelectPost(inputText, select) {

  /**
   * Initialise l'objet de sélection des posts.
   */
  this.init = function() {

    var posts = post.readPosts(); // Posts à afficher
    var oldOptionSelected = null;
    var option = null;

    /**
     * Listener placé sur le select.
     */
    function selectListener(event) {
      try {
        var options = select.childNodes;
        var optionSelected = null;
        var textBefore = null;
        var textAfter = null;

        // Une ancienne et une nouvelle option est sélectionnée
        if(oldOptionSelected != null && select.selectedIndex != -1) {
          oldOptionSelected.selected = '';
        }

        // Une option valide est sélectionnée: première option = option vide
        if(select.selectedIndex != -1 && select.selectedIndex != 0) {
          optionSelected = options[select.selectedIndex];
          textBefore = inputText.value.substring(0, inputText.selectionStart);
          textAfter = inputText.value.substring(inputText.selectionEnd, inputText.value.length);
          inputText.value = textBefore + '\n' + optionSelected.value + '\n' + textAfter;
          inputText.focus();
        }

        if(select.selectedIndex != -1) {
          oldOptionSelected = options[select.selectedIndex];
        }
        else {
          oldOptionSelected = null;
        }
      }
      catch(exception) {
        alert('name: ' + exception.name + 'exception: ' + exception.message);
      }
    }

      select.addEventListener('click', selectListener, false);

    // Ajout d'une option vide
    option = select.appendChild(document.createElement('option'));
    option.setAttribute('value', '');
    option.appendChild(document.createTextNode(''));

    // Ajout des posts
    for (var i = 0; i < posts.length; i++) {
      option = select.appendChild(document.createElement('option'));
      option.setAttribute('value', posts[i].value);
      option.appendChild(document.createTextNode(posts[i].name));
    }
  }
    }

/**
 * Fonctions de chargement des divers items de gestion et de sélection
 * des posts.
 */
var loader = {

  /**
   * Charge les élements permettant l'affichage des popups servant
   * à sauvegarder un post.
   */
  loadSavePost : function() {

    var imgSavePost = document.createElement('img');
    var urlSavePost = document.createElement('a');
    var divToolbars = document.getElementsByClassName('toolbar');
    var tmpUrl = null;

    /**
     * Ecouteur appelé pour sauvegarder un message.
     */
    function urlSavePostListener(event) {

      /**
       * Ecouteur appelé après un appel ajax pour sauvegarder un post
       */
      function ajaxOpenSavePostListener(xmLHttpRequest) {

        var regExp = new RegExp('<textarea[\\s\\S]*</textarea>','g');
        var bbCode = '';

        try {
          // Récupération du textarea et de son contenu
          bbCode = regExp.exec(xmLHttpRequest.responseText) + "";
          // Suppression des balises du textarea
          bbCode = bbCode.substring(bbCode.indexOf('>') + 1, bbCode.lastIndexOf('<'));

          var x = event.clientX + document.documentElement.scrollLeft + 'px';
          var y = event.clientY + document.documentElement.scrollTop + 'px';

          // Popup d'enregistrement du message
          var savePost = new SavePost('popuptest', bbCode);
          savePost.display(x, y);
        }
        catch(exception) {
          alert('name: ' + exception.name + ' exception: ' + exception.message);
        }
      }

        try {
          // Contenu de l'attribut onclik affichant le bb code du message
          var onclickBbCode = null;
          var hrefEdit = null;
          var childNodes = event.target.parentNode.parentNode.getElementsByTagName('a');
          var pathname = null;
          var url = null;

          // Recherche du bouton bbcode ou edit
          for(var cpt=0; cpt<childNodes.length && onclickBbCode == null && hrefEdit == null; cpt++) {
            if(childNodes[cpt].hasAttribute('onclick') &&
               childNodes[cpt].getAttribute('onclick').indexOf('bbcode', 0) > -1) {
              onclickBbCode = childNodes[cpt].getAttribute('onclick');
            }
            else if(childNodes[cpt].hasAttribute('href') &&
                    childNodes[cpt].innerHTML.indexOf('edit', 0) > -1){
              hrefEdit = childNodes[cpt].getAttribute('href');
            }
          }

          // Bouton edit trouvé
          if(hrefEdit != null) {
            pathname = hrefEdit;
          }
          // Bouton BBCode trouvé
          else {
            pathname = onclickBbCode.split(new RegExp('[\']','g'))[1];
          }

          // Récupération de l'url et du path de la page affichant le bb code du message
          url = window.location.protocol + "//" + window.location.host + pathname;

          // Chargement en AJAX
          tools.loadPage(url, 'get', null, ajaxOpenSavePostListener);
        }
      catch(exception) {
        alert('name: ' + exception.name + ' exception: ' + exception.message);
      }
    }

      css.loadSavePostCss();

    imgSavePost.setAttribute('alt', 'Marquer le message');
    imgSavePost.setAttribute('src', Image.save);
    imgSavePost.setAttribute('title', 'Cliquez ici pour ajouter le message courant aux messages sauvegardés.');
    urlSavePost.appendChild(imgSavePost);

    // Ajout des boutons de sauvegarde de post
    for (var i = 0; i < divToolbars.length; i++) {

      var divLeftToolbar = divToolbars[i].firstChild;

      // Bouton BBCode ou Edit
      if((typeof divLeftToolbar != undefined) &&
         ((divLeftToolbar.innerHTML.indexOf('bbcode', 0) > -1) ||
          (divLeftToolbar.innerHTML.indexOf('edit', 0) > -1))) {
        tmpUrl = divLeftToolbar.appendChild(urlSavePost.cloneNode(true));
        tmpUrl.addEventListener('click', urlSavePostListener, false);
      }
    }
  },

  /**
   * Charge les élements d'affichage de la popup de gestion des posts.
   */
  loadPostManager : function() {

    var aPostManager = document.createElement('a');
    var spanPostManager = document.createElement('span');

    /**
     * Ecouteur appellé pour afficher le gestionnaire de posts.
     */
    function aPostManagerListener(event) {
      try {
        var managePost = new PostManager('managePost');
        managePost.display('700px');
      }
      catch(exception) {
        alert('name: ' + exception.name + 'exception: ' + exception.message);
      }
    }

      // On a un header
      if(document.getElementsByClassName('hfrheadmenu').length > 100000000) {

        css.loadPostManagerCss();

        aPostManager.setAttribute('class', 'cHeader');
        aPostManager.style.cursor = 'pointer';
        aPostManager.appendChild(document.createTextNode('Gestion des posts'));
        aPostManager.addEventListener('click', aPostManagerListener, false);

        spanPostManager.appendChild(aPostManager);
        tools.addElementInHeaderToolbar(spanPostManager);
      }
  },

  /**
   * Charge les éléments d'ajout de posts sauvegardés dans la zone de
   * réponse rapide.
   */
  loadSelectPost : function() {
    var textarea = document.getElementById('content_form');
    var parentTextarea = null;
    var select = document.createElement('select');
    var form = null;
    var selectPost = null;
    var buttonPostManager = null;
    var previousSibling = null;

    /**
     * Ecouteur appellé pour afficher le gestionnaire de posts.
     */
    function buttonPostManagerListener(event) {
      try {
        var managePost = new PostManager('managePost');
        managePost.display('700px');
      }
      catch(exception) {
        alert('name: ' + exception.name + 'exception: ' + exception.message);
      }
    }
      buttonPostManager = tools.createButton('Gestion des posts', buttonPostManagerListener);
    buttonPostManager.className = PLUGIN_NAME + '_buttonPost';

    if(textarea != null) {
      previousSibling = textarea;
      parentTextarea = textarea.parentNode;

      // Ajout d'un bouton de gestion des post avant le premier
      // saut de ligne précédent le textarea
      do {
        if(previousSibling.tagName == 'BR') {
          parentTextarea.insertBefore(document.createTextNode(' '), previousSibling);
          parentTextarea.insertBefore(buttonPostManager, previousSibling);
          previousSibling = null;
        }
        else {
          previousSibling = previousSibling.previousSibling;
        }
      }
      while(previousSibling != null && previousSibling.tagName != 'br')

        select.setAttribute('multiple', 'multiple');
      select.setAttribute('class', PLUGIN_NAME + '_selectPost');
      parentTextarea.insertBefore(select, textarea.nextSibling);

      // Zone d'édition
      if(window.location.pathname.indexOf('message.php', 0) >= 0) {
        css.loadSelectPostCss(true);
      }
      // Réponse rapide
      else {
        css.loadSelectPostCss(false);
      }

      selectPost = new SelectPost(textarea, select, form);
      selectPost.init();
    }
  }
};

try {
  css.loadPopupCss();
  css.loadModalePopupCss();
  loader.loadSavePost();
  loader.loadPostManager();
  loader.loadSelectPost();
}
catch(exception) {
  alert('name: ' + exception.name + 'exception: ' + exception.message);
}
