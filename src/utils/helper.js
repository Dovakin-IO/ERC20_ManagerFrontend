import { Select, Modal, Spin, message, Progress } from 'antd';
 const FileSaver = require('file-saver');

 export function exportXls(address, filename) {
     let request = new XMLHttpRequest();
     let waitingModal;
     let percent = 0;
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
            // waitingModal.content.Progress.percent = percentComplete * 100
        }
     }, false);
     request.send();
     waitingModal = Modal.info({
         maskClosable: false,
         okText: '导出中...',
         onOk: function(close) {
             close = null;
             message.info("请稍后...");
         },
         content: (
             <div>
                 <p>正在生成表单，请稍后...</p>
                 <div>
                     <Spin size="large">
                        <p width={294}></p>
                     </Spin>
                 </div>
                 <Progress percent={percent} />
                 <div style={{position:'absolute',zIndex:99999,bottom:'29px',right:'39px',background:'white',width:'86px',height:'40px'}}>导出中...</div>
             </div>
         ),
     });
 }