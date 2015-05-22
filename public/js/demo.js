/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global $:false */

'use strict';

$(document).ready(function() {
  var audio = $('.audio').get(0),
    textArea = $('#textArea');

	var speechSynthesisOptions = {
		audioElement: audio,
		url: 'http://localhost:3000'
	};

	var speechSynthesis = new SpeechSynthesis(speechSynthesisOptions);

  var textChanged = false,
    spanishText = 'El servicio de Voz a Texto utiliza la tecnología de síntesis de voz de IBM para convertir texto en Inglés o Español en una señal de audio. El audio es enviado de vuelta al cliente con un retraso mínimo. El servicio puede ser accedido a través de una interfaz REST.',
    englishText = 'The Text to Speech service uses IBM\'s speech synthesis capabilities to convert English or Spanish text to an audio signal. The audio is streamed back to the client with minimal delay. The service can be accessed via a REST interface.',
		frenchText = 'Le service TTS d\'IBM profite de ses capacités de synthèse de la parole à partir du texte pour transformer le texte à un signal audio. Le signal audio est ensuite passé au client dans un délai minimal. On peut appeler Le service via une interface REST',
		germanText = 'German text placeholder',
		italianText = 'Italian text placeholder';


  $('#textArea').val(englishText);

  $('#textArea').change(function(){
    textChanged = true;
  });

  $('#voice').change(function(){
    if (!textChanged) {
      switch($(this).val().substring(0, 2)) {
				case 'es':
					$('#textArea').val(spanishText);
					break;
				case 'fr':
					$('#textArea').val(frenchText);
					break;
				case 'de':
					$('#textArea').val(germanText);
					break;
				case 'it':
					$('#textArea').val(italianText);
					break;
				default:
					$('#textArea').val(englishText);
					break;
			}
    }
  });

	speechSynthesis.onvoiceschanged = function() {
		var voices = speechSynthesis.getVoices();
		console.log('voices', voices);
		$.each(voices, function(idx, voice) {
			var voiceName = voice.name.substring(6, voice.name.length - 5);
			var optionText = voice._gender + ' voice: ' + voiceName + ' (' + voice.lang + ')';
			$('#voice')
			.append($('<option>', { value : voice.name })
				.prop('selected', voice.name === 'en-US_MichaelVoice' ? true : false)
				.text(optionText));
		});
	};


  // IE and Safari not supported disabled Speak button
  if ($('body').hasClass('ie') || $('body').hasClass('safari')) {
    $('.speak-button').prop('disabled', true);
  }

  if ($('.speak-button').prop('disabled')) {
    $('.ie-speak .arrow-box').show();
  }

  $('.audio').on('error', function () {
    $('.result').hide();
    $('.errorMgs').text('Error processing the request.');
    $('.errorMsg').css('color','red');
    $('.error').show();
  });

  $('.audio').on('loadeddata', function () {
    $('.result').show();
    $('.error').hide();
  });

  $('.download-button').click(function() {
    textArea.focus();
    if (validText(textArea.val())) {
			var options = {
				text: $('#textArea').val(),
				voice: $('#voice').val(),
				download: true
			};
			var utterance = new SpeechSynthesisUtterance(options);
			speechSynthesis.speak(utterance);
    }
  });

  $('.speak-button').click(function() {
    $('.result').hide();
    audio.pause();

    $('#textArea').focus();
    if (validText(textArea.val())) {

			var options = {
				text: $('#textArea').val(),
				voice: $('#voice').val()
			};

			var utterance = new SpeechSynthesisUtterance(options);
			speechSynthesis.speak(utterance);

    }
  });

  function containsAllLatin1(str) {
    return  /^[A-z\u00C0-\u00ff\s?@¿"'\.,-\/#!$%\^&\*;:{}=\-_`~()]+$/.test(str) ;
  }

  function validText(text) {
    $('.error').hide();
    $('.errorMsg').text('');
    $('.latin').hide();

    if ($.trim(text).length === 0) { // empty text
      $('.errorMsg').text('Please enter the text you would like to synthesize in the text window.');
      $('.errorMsg').css('color','#00b2ef');
      $('.error').show();
      return false;
    }

    if (!containsAllLatin1(text)) {
      $('.latin').show();
      $('.error').show();
       return false;
    }
    return true;
  }
});