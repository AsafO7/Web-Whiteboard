import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useRoomContext } from "../contexts/RoomProvider";
import { Point } from "../contexts/DrawingsProvider";
import { useUserContext } from "../contexts/UserProvider";
import { drawingProps } from "../components/Room/Room";
import { useDrawingsContext } from "../contexts/DrawingsProvider";

export function useOnDraw(onDraw: { (ctx: CanvasRenderingContext2D | null | undefined, point: Point | null, prevPoint: Point | null, isEraser: boolean): void,
    }, socket: Socket<DefaultEventsMap, DefaultEventsMap>, drawingStats: drawingProps, isEraser: boolean) {

    const { user } = useUserContext()
    const { room, setRoom } = useRoomContext()
    const { drawingHistory, setDrawingHistory } = useDrawingsContext()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawingRef = useRef<boolean>(false)
    const prevPointRef = useRef<Point | null>(null)

    const mouseMoveListenerRef = useRef<((e: MouseEvent) => void) | null>(null)
    const mouseUpListenerRef = useRef<(() => void) | null>(null)

    let path = useRef<Point[]>([])

    useEffect(() => {
        function initMouseMoveListener() {
            const mouseMoveListener = (e: MouseEvent) => {
               if(isDrawingRef.current) {
                    const point = computePointInCanvas(e.clientX, e.clientY)
                    if(point) path.current.push(point)
                    const ctx = canvasRef.current?.getContext("2d")
                    if(onDraw) onDraw(ctx, point, prevPointRef.current, isEraser)
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
                let arr: String[] = []
                arr.concat(room.drawingUsers)
                arr.filter((name) => name !== user.name)
                setRoom((prev) => { return { ...prev, drawingUsers: arr}})
                socket.emit("endDrawing", user.name)
                
                // To prevent lines connecting after we finished drawing
                prevPointRef.current = null
                
                if(path.current.length !== 0) {
                    let drawings = drawingHistory
                    drawings.push({path: path.current, color: drawingStats.colorRef?.current?.value, width: drawingStats.width, isEraser, userWhoDrew: user.name})
                    setDrawingHistory(drawings)
                    socket.emit("save-drawing", path.current, drawingStats.colorRef?.current?.value, drawingStats.width, user.currentRoom, isEraser, user.name)
                    path.current = []
                }
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

        // Cleanup function
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
    },[drawingHistory, drawingStats.colorRef, drawingStats.colorRef?.current?.value, drawingStats.width, isEraser, onDraw, room, setDrawingHistory, setRoom, socket, user.currentRoom, user.name])

    function setCanvasRef(ref: HTMLCanvasElement | null) {
        if(!ref) return
        canvasRef.current = ref;
    }

    function getCanvasRef() {
        if(!canvasRef.current) return
        return canvasRef.current
    }

    function onMouseDown() {
        isDrawingRef.current = true
        // let arr: String[] = []
        // arr.concat(room.drawingUsers)
        // arr.push(user.name)
        // setRoom((prev) => { return { ...prev, drawingUsers: arr}})
        socket.emit("startDrawing", user.name)

    }

    return { setCanvasRef, onMouseDown, getCanvasRef, isDrawingRef }
};