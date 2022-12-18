import { useRef } from "react";

// type Point = { 
//     point: {
//         x: number;
//         y: number;
//     } | null
// }

// type EventPoint = {
//     eventPoint: (e: {
//         clientX: number;
//         clientY: number;
//     }) => void
// }

export function useOnDraw(onDraw: { (ctx: CanvasRenderingContext2D | null | undefined, point: { x: number; y: number; } | null): void }) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    function setCanvasRef(ref: null) {
        if(!ref) return
        canvasRef.current = ref;
        initMouseMoveListener()
    }

    function initMouseMoveListener() {
        const mouseMoveListener = (e: MouseEvent) => {
            const point = computePointInCanvas(e.clientX, e.clientY)
            const ctx = canvasRef.current?.getContext("2d")
            if(onDraw) onDraw(ctx, point)
            // console.log(point)
        }
        window.addEventListener("mousemove", mouseMoveListener)
    }

    function computePointInCanvas(clientX: number, clientY: number) {
        if(canvasRef.current) {
            const boundingRect = canvasRef.current?.getBoundingClientRect()
            return {
                x: clientX - boundingRect?.left,
                y: clientY - boundingRect?.top,
            }
        }
        else return null
    }

    return setCanvasRef

};