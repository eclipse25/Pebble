import { useState, useEffect } from "react";
import { Typography, Container, Box } from "@mui/material";
import Calendar from "../components/Calendar";

const DraggableResizableBox = ({ children, initialX, initialY, initialWidth, initialHeight }: 
    { children: React.ReactNode; initialX: number; initialY: number; initialWidth: number; initialHeight: number }) => {
    
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // 마우스를 누르면 드래그 시작
    const handleMouseDown = (event: React.MouseEvent) => {
        setDragging(true);
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y
        });
    };

    // 크기 조절을 위한 마우스 다운 이벤트
    const handleResizeMouseDown = (event: React.MouseEvent) => {
        event.stopPropagation(); // 드래그와 충돌 방지
        setResizing(true);
        setOffset({
            x: event.clientX,
            y: event.clientY,
        });
    };

    // 마우스 이동 이벤트 (드래그 or 크기 조절)
    const handleMouseMove = (event: MouseEvent) => {
        if (dragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y
            });
        } else if (resizing) {
            const newWidth = size.width + (event.clientX - offset.x);
            const newHeight = size.height + (event.clientY - offset.y);
            setSize({
                width: Math.max(150, newWidth), // 최소 width 제한
                height: Math.max(100, newHeight), // 최소 height 제한
            });
            setOffset({ x: event.clientX, y: event.clientY }); // 새로운 기준점 업데이트
        }
    };

    // 마우스 버튼을 떼면 드래그/리사이징 종료
    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
    };

    // document 레벨에서 이벤트 리스너 추가 (크기 조절 유지)
    useEffect(() => {
        if (dragging || resizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, resizing]);

    return (
        <Box
            sx={{
                position: "absolute",
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                backgroundColor: "white",
                // border: 1,
                // borderColor: "primary.light",
                boxShadow: 3,
                cursor: dragging ? "grabbing" : "grab",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                overflow: "hidden",
            }}
            onMouseDown={handleMouseDown}
        >
            {children}

            {/* 크기 조절 핸들 (오른쪽 하단 모서리) */}
            <Box
                sx={{
                    width: 12,
                    height: 12,
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "gray",
                    cursor: "nwse-resize",
                }}
                onMouseDown={handleResizeMouseDown}
            />
        </Box>
    );
};

const Home = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{
                width: "100vw",
                height: "100vh",
                boxSizing: "border-box",
                backgroundColor: "#f5f5f5",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* 캘린더 박스 */}
            <DraggableResizableBox initialX={50} initialY={100} initialWidth={300} initialHeight={350}>
                <Calendar onDateSelect={setSelectedDate} />
            </DraggableResizableBox>

            {/* 날짜 정보 박스 */}
            <DraggableResizableBox initialX={400} initialY={100} initialWidth={300} initialHeight={200}>
                {selectedDate ? (
                    <>
                        <Typography variant="h4" align="center">
                            {selectedDate.getFullYear()}-{selectedDate.getMonth() + 1}-{selectedDate.getDate()}
                        </Typography>
                        <Typography variant="body1" align="center" mt={2}>
                            선택한 날짜의 내용을 여기에 표시할 수 있습니다.
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography align="center">Box 2</Typography>
                    </>
                )}
            </DraggableResizableBox>

            {/* 박스 3 */}
            <DraggableResizableBox initialX={750} initialY={100} initialWidth={300} initialHeight={200}>
                <Typography align="center">Box 3</Typography>
            </DraggableResizableBox>
        </Container>
    );
};

export default Home;
