// eslint-disable no-console

if (!location.hash) {
  // eslint-disable-next-line unicorn/number-literal-case
  location.hash = Math.floor(Math.random() * 0xffffff).toString(16)
}

const roomHash = location.hash.substring(1)
const drone = new ScaleDrone('yiS12Ts5RdNhebyM')
const roomName = 'observable-' + roomHash
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}

let room
let pc
let userStream

function onSuccess() {}
function onError(error) {
  console.error(error)
}

drone.on('open', error => {
  if (error) {
    return onError(error)
  }
  room = drone.subscribe(roomName)
  room.on('open', error => {
    if (error) {
      onError(error)
    }
  })

  room.on('members', members => {
    console.log('MEMBERS', members)
    const isOfferer = members.length === 2
    startWebRTC(isOfferer)
  })
})

function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  })
}

function startWebRTC(isOfferer) {
  pc = new RTCPeerConnection(configuration)

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({ candidate: event.candidate })
    }
  }

  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError)
    }
  }

  pc.ontrack = event => {
    const stream = event.streams[0]
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
      remoteVideo.srcObject = stream
    }
  }

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true
    })
    .then(stream => {
      userStream = stream
      localVideo.srcObject = stream
      stream.getTracks().forEach(track => pc.addTrack(track, stream))
    }, onError)

  room.on('data', (message, client) => {
    if (client.id === drone.clientId) {
      return
    }

    if (message.sdp) {
      pc.setRemoteDescription(
        new RTCSessionDescription(message.sdp),
        () => {
          if (pc.remoteDescription.type === 'offer') {
            pc.createAnswer().then(localDescCreated).catch(onError)
          }
        },
        onError
      )
    } else if (message.candidate) {
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate),
        onSuccess,
        onError
      )
    }
  })
}

function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({ sdp: pc.localDescription }),
    onError
  )
}

// ui

document.getElementById('video-btn').addEventListener('click', () => {
  const videoTrack = userStream
    .getTracks()
    .find(track => track.kind === 'video')

  if (videoTrack.enabled) {
    videoTrack.enabled = false
    document.getElementById('video-btn').innerHTML = 'Enable Video'
  } else {
    videoTrack.enabled = true
    document.getElementById('video-btn').innerHTML = 'Disable Video'
  }
})

document.getElementById('audio-btn').addEventListener('click', () => {
  const audioTrack = userStream
    .getTracks()
    .find(track => track.kind === 'audio')

  if (audioTrack.enabled) {
    audioTrack.enabled = false
    document.getElementById('audio-btn').innerHTML = 'Enable Audio'
  } else {
    audioTrack.enabled = true
    document.getElementById('audio-btn').innerHTML = 'Disable Audio'
  }
})
