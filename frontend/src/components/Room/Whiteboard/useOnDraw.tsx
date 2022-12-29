import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useRoomContext } from "../../../contexts/RoomProvider";
import { Point } from "../../../contexts/RoomsProvider";
import { useUserContext } from "../../../contexts/UserProvider";
import { drawingProps } from "../Room";

export function useOnDraw(onDraw: { (ctx: CanvasRenderingContext2D | null | undefined, point: Point | null, prevPoint: Point | null): void,
    }, socket: Socket<DefaultEventsMap, DefaultEventsMap>, drawingStats: drawingProps, setDrawingStats: React.Dispatch<React.SetStateAction<drawingProps>>) {

    const { user } = useUserContext()
    const { room } = useRoomContext()

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
                // room.drawingHistory.drawing.push(path.current)
                if(path.current.length !== 0) {
                    room.drawingHistory.push({path: path.current, color: drawingStats.color})
                    socket.emit("save-drawing", path.current, drawingStats.color, user.currentRoom)
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
    },[drawingStats.color, onDraw, room.drawingHistory, socket, user.currentRoom])

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
    }

    // useEffect(() => {
    //     socket.on("receive-drawing", (path: {x: number, y: number}[]) => {
    //       for(let i = 0; i < path.length - 1; i++) {
    //         onDraw(canvasRef.current?.getContext("2d"), path[i+1], path[i])
    //       }
    //     })
    //     return(() => {
    //       socket.removeListener("receive-drawing")
    //     })
    // },[onDraw, socket])

    return { setCanvasRef, onMouseDown, getCanvasRef, isDrawingRef }
};