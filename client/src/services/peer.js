class PeerService{
    constructor(){
        if(!this.peer){
            this.peer=new RTCPeerConnection({
                iceServers: [
                  { urls: 'stun:stun1.l.google.com:19302' },
                  { urls: 'stun:stun2.l.google.com:19302' },
                  { urls: 'stun:stun3.l.google.com:19302' },
                  { urls: 'stun:stun4.l.google.com:19302' },
                ]
              });
        }
    }

    async getOffer(){
        if(this.peer){
            const offer=await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
    async getAnswer(offer){
        if(this.peer){
            // their offer
            await this.peer.setRemoteDescription(offer);
            const ans=await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }

    async setRemoteAns(ans){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    
}
export default new PeerService();