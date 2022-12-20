import { useEffect, useRef } from "react";

export function useOnDraw(onDraw: { (ctx: CanvasRenderingContext2D | null | undefined, point: { x: number; y: number; }| null, prevPoint: { x: number; y: number; } | null): void }) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawingRef = useRef<boolean>(false)
    const prevPointRef = useRef<{x: number, y: number} | null>(null)

    const mouseMoveListenerRef = useRef<((e: MouseEvent) => void) | null>(null)
    const mouseUpListenerRef = useRef<(() => void) | null>(null)

    useEffect(() => {
        function initMouseMoveListener() {
            const mouseMoveListener = (e: MouseEvent) => {
               if(isDrawingRef.current) {
                    const point = computePointInCanvas(e.clientX, e.clientY)
                    const ctx = canvasRef.current?.getContext("2d")
                    if(onDraw) onDraw(ctx, point, prevPointRef.current)
                    prevPointRef.current = point
               }
            }
            mouseMoveListenerRef.current = mouseMoveListener
            window.addEventListener("mousemove", mouseMoveListener)
        }

        // We add the eventListener to the window object because we don't want to draw when the mouse leaves the canvas
        function initMouseUpListener() {
            if(!canvasRef.current) return
            const listener = () => {
                isDrawingRef.current = false
                // To prevent lines connecting after we finished drawing
                prevPointRef.current = null
            }
            mouseUpListenerRef.current = listener
            window.addEventListener("mouseup", listener)
        }

         // Computing where the (0,0) point is in the canvas
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

        function removeListeners() {
            if(mouseMoveListenerRef.current) window.removeEventListener("mousemove", mouseMoveListenerRef.current)
            if(mouseUpListenerRef.current) window.removeEventListener("mouseup", mouseUpListenerRef.current)
        }
        initMouseMoveListener()
        initMouseUpListener()
        // Runs when the component unmounts
        return () => {
           removeListeners()
        }
    },[onDraw])

    function setCanvasRef(ref: null) {
        if(!ref) return
        canvasRef.current = ref;
    }

    function onMouseDown() {
        isDrawingRef.current = true
    }

    return { setCanvasRef, onMouseDown }

    /*const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef<boolean>(false)

    const mouseMoveListenerRef = useRef<((e: MouseEvent) => void) | null>(null)
    const mouseDownListenerRef = useRef<(() => void) | null>(null)
    const mouseUpListenerRef = useRef<(() => void) | null>(null)

    const prevPointRef = useRef<{x: number, y: number} | null>(null)

    useEffect(() => {
        // Runs when the component unmounts
        return () => {
            if(mouseMoveListenerRef.current) window.removeEventListener("mousemove", mouseMoveListenerRef.current)
            if(mouseUpListenerRef.current) window.removeEventListener("mouseup", mouseUpListenerRef.current)
        }
    },[])
    
    function setCanvasRef(ref: null) {
        if(!ref) return
        if(mouseDownListenerRef.current) canvasRef.current?.removeEventListener("mousedown", mouseDownListenerRef.current)
        canvasRef.current = ref;
        initMouseMoveListener()
        initMouseDownListener()
        initMouseUpListener()
    }

    function initMouseMoveListener() {
        const mouseMoveListener = (e: MouseEvent) => {
           if(isDrawingRef.current) {
                const point = computePointInCanvas(e.clientX, e.clientY)
                const ctx = canvasRef.current?.getContext("2d")
                if(onDraw) onDraw(ctx, point, prevPointRef.current)
                prevPointRef.current = point
           }
        }
        mouseMoveListenerRef.current = mouseMoveListener
        window.addEventListener("mousemove", mouseMoveListener)
    }

    // We add the eventListener to the canvasRef because we only want to draw within the canvas
    function initMouseDownListener() {
        if(!canvasRef.current) return
        const listener = () => {
            isDrawingRef.current = true
        }
        mouseDownListenerRef.current = listener
        canvasRef.current.addEventListener("mousedown", listener)
    }

    // We add the eventListener to the window object because we don't want to draw when the mouse leaves the canvas
    function initMouseUpListener() {
        if(!canvasRef.current) return
        const listener = () => {
            isDrawingRef.current = false
            // To prevent lines connecting after we finished drawing
            prevPointRef.current = null
        }
        mouseUpListenerRef.current = listener
        window.addEventListener("mouseup", listener)
    }

    // Computing where the (0,0) point is in the canvas
    function computePointInCanvas(clientX: number, clientY: number) {
        if(canvasRef.current) {
            const boundingRect = canvasRef.current?.getBoundingClientRect()
            return {
                x: clientX - boundingRect?.left,
                y: clientY - boundingRect?.top,
            }
        }
        else return null
    }*/

    // return setCanvasRef

};