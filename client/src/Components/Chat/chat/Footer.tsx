
const Footer = (props:any) =>{
    return (
        <div className="d-flex">
                <button className="btn btn-secondary ms-1"><i className="bi text-light bi-folder-symlink-fill"></i></button>
                <input type="file" id="fileInput" style={{display:"none"}}/>
                <form className="w-100 send-message">
                    <div className="d-flex">
                        <input type="text" className="form-control       text-white" name="message" id="enter-message" placeholder="Send a message"/>
                        
                        <button type="submit" className="btn btn-danger me-1"><i className="bi  bi-arrow-up-right"></i></button>
                    </div>
                </form>
            </div>
    )
}
export default Footer;