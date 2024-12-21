import { useEffect, useRef } from "react"

const Canvas = props => {
    const {draw ,...rest} = props
    const ref=useRef();


    useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext('2d')
        let count = 0
        let animationID

        const renderer = () => {
            count ++
            draw(context,count)
            animationID = window.requestAnimationFrame(renderer)
        }
        renderer()

        return () => window.cancelAnimationFrame(animationID)
    },[])

    return <canvas ref={ref} {...rest} />
}

export default Canvas