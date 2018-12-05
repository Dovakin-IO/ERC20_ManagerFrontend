import { Modal, Progress } from 'antd';
const FileSaver = require('file-saver');

class DownloadModal extends React.Component {

    state = {
        visible: false,
        percent: 0,
    }

    componentWillMount(){
        this.setState({
            visible: this.props.visible,
        })
    }

    

    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    
    handleDone = () => {
        setTimeout(() => {
            this.setState({
                visible: false,
            })
        },400)
    }

    startDownload = (address) => {
        request.open("GET", address, true);
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Authkey', sessionStorage.getItem("auth"));
        request.responseType="blob";
        request.onload=function(e) {
            FileSaver.saveAs(e.target.response, filename);
            setTimeout(() => waitingModal.destroy(), 400);
        };
        request.addEventListener("progress", function(evt) {
           if (evt.lengthComputable) {
               let percentComplete = evt.loaded / evt.total;
               this.setState({
                    percent: percentComplete,
               })
               // waitingModal.content.Progress.percent = percentComplete * 100
           }
        }, false);
        request.send();
    }

    render() {
        return (            
            <div>
                {
                    this.startDownload()
                }
                <Modal
                    visible={this.state.visible}
                    title="正在生成数据表单，请耐心等待..."
                    onOk={false}
                    onCancel={false}
                    >
                    <Progress percent={this.state.percent} />
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(<DownloadModal />, mountNode);