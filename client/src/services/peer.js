class PeerService {
    constructor() {
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun1.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
            {
              urls: "turn:YOUR_TURN_SERVER_URL",
              username: "YOUR_USERNAME",
              credential: "YOUR_CREDENTIAL",
            },
          ],
        });
  
        // Add logging for debugging
        this.peer.addEventListener("icecandidate", (event) => {
          if (event.candidate) {
            console.log("New ICE candidate:", event.candidate);
          } else {
            console.log("All ICE candidates sent.");
          }
        });
  
        this.peer.addEventListener("iceconnectionstatechange", () => {
          console.log("ICE Connection State:", this.peer.iceConnectionState);
        });
  
        this.peer.addEventListener("signalingstatechange", () => {
          console.log("Signaling State:", this.peer.signalingState);
        });
  
        this.peer.addEventListener("connectionstatechange", () => {
          console.log("Connection State:", this.peer.connectionState);
        });
      }
    }
  
    async getOffer() {
      if (this.peer) {
        try {
          const offer = await this.peer.createOffer();
          await this.peer.setLocalDescription(offer);
          return offer;
        } catch (error) {
          console.error("Error creating offer:", error);
        }
      }
    }
  
    async getAnswer(offer) {
      if (this.peer) {
        try {
          await this.peer.setRemoteDescription(offer);
          const answer = await this.peer.createAnswer();
          await this.peer.setLocalDescription(answer);
          return answer;
        } catch (error) {
          console.error("Error creating answer:", error);
        }
      }
    }
  
    async setRemoteAns(ans) {
      if (this.peer) {
        try {
          await this.peer.setRemoteDescription(ans);
        } catch (error) {
          console.error("Error setting remote answer:", error);
        }
      }
    }
  }
  
  export default new PeerService();
  