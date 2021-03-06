var status_check_timer_initial_value = 15,
		status_check_timer = status_check_timer_initial_value;
var check_status_text = 'Check status';

function checkStatus() {
	status_check_timer = status_check_timer_initial_value;

	console.log("checking status");
  Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StatusCheck', []);
}

function updateTimer() {
	if(status_check_timer < 0) {
		checkStatus();
	}

	var text = check_status_text + ' (' + status_check_timer + ')';
	document.getElementById('checkStatus').textContent = text;

	status_check_timer--;
}

document.addEventListener('NexpaqAPIReady', function(event) {
	Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
    // we don't care about data not related to our module
    if(event.moduleUuid != Nexpaq.Arguments[0]) return;
		if(event.dataSource == 'StateChangeResponse' && event.variables.result == 'success') {
			checkStatus();
		}
		if(event.dataSource == 'DefaultStateChangeRequestResponse' && event.variables.result == 'success') {
			checkStatus();
		}
		if(event.dataSource == 'StatusRequestResponse') {
			if(event.variables.status == 'connected') {
				document.getElementById('speakerStatus').textContent = 'On';
			} else if(event.variables.status == 'disconnected') {
				document.getElementById('speakerStatus').textContent = 'Off'
			}
			if(Nexpaq.Arguments[2] == 'moduware.module.speaker') {
				if(event.variables.defaultState == 'connected') {
					document.getElementById('speakerDefaultStatus').textContent = 'On';
				} else if(event.variables.defaultState == 'disconnected') {
					document.getElementById('speakerDefaultStatus').textContent = 'Off'
				}
			}
		}
		if(event.dataSource == 'BluetoothNameRequestResponse') {
			document.getElementById('speakerBluetoothName').textContent = event.variables.bluetoothName;
		}
	});

	checkStatus();
});

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function(event) {
	Nexpaq.Header.create('Speaker');

	document.getElementById('checkStatus').addEventListener('click', function() {
    checkStatus();
  });

	document.getElementById('requestBluetoothName').addEventListener('click', function() {
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'AskBluetoothName', []);
	});

	document.getElementById('connect').addEventListener('click', function() {
		console.log("connecting");
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'Connect', [1]);
		status_check_timer = 5;
	});

	document.getElementById('disconnect').addEventListener('click', function() {
		console.log("disconnecting");
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'Disconnect', [0]);
		status_check_timer = 5;
	});

	document.getElementById('setDefaultStateOn').addEventListener('click', function() {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetDefaultStateAsOn', []);
		status_check_timer = 5;
	});

	document.getElementById('setDefaultStateOff').addEventListener('click', function() {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetDefaultStateAsOff', []);
		status_check_timer = 5;
	});

	setInterval(updateTimer, 1000);
	
});
