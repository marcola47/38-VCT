import clsx from "clsx";
import s from "./style.module.scss";

type ErrorBlockProps = {
  error: AppErrorOptions,
  overrideClasses?: string,
  overrideStyles?: React.CSSProperties
}

export function ErrorBlock(props: ErrorBlockProps): React.ReactNode {  
  const { error, overrideClasses, overrideStyles } = props;
  
  const {
    code,
    status,
    message
  } = error
  
  const title = "Ocorreu um erro ao processar sua requisição"
  console.error(code);

  return (
    <div 
      className={ clsx(s.errorBlock, overrideClasses) }
      style={ overrideStyles }
    >
      <div className={ s.title }>
        { title }
      </div>   

      <div className={ s.content }>
        {
          status &&
          <div className={ s.status }>
            { status }:
          </div>
        }

        <div className={ s.message }>
          { message }
        </div>
      </div>   
    </div>
  )
}