
type InputProp={
    id:string, label:string, type:string, placeholder?:string, value:string, onChange:any;
}
const Input = (props:InputProp) =>{
    return (
        <>
        <label className="form-label" htmlFor={props.id}>{props.label}</label>
        <input required className="form-control text-light bg-dark" placeholder={props.placeholder? props.placeholder : ""} type={props.type} value={props.value} onChange={props.onChange}
         id={props.id} name={props.id}/>
        </>
    )
}
export default Input;