class PeerService{
    constructor(){
        if(!this.peer){
            this.peer=new RTCPeerConnection({
                iceServers: [
                  { urls: 'stun:stun1.l.google.com:19302' },
                  { urls: 'stun:stun2.l.google.com:19302' },
                  { urls: 'stun:stun3.l.google.com:19302' },
                  { urls: 'stun:stun4.l.google.com:19302' },
                  { urls: 'turn:relay1.expressturn.com:3478', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: 'ef4b3b3c8d5c2b08c7e5db1f' }
                  ]    
              });
        }
    }

    async getOffer(){
        if(this.peer){
            const offer=await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            return offer;
        }
    }
    async getAnswer(offer){
        if(this.peer){
            // their offer
            await this.peer.setRemoteDescription(offer);
            const ans=await this.peer.createAnswer();
            await this.peer.setLocalDescription(ans);
            return ans;
        }
    }

    async setRemoteAns(ans){
        if(this.peer){
            await this.peer.setRemoteDescription(ans);
        }
    }

    
}
export default new PeerService();