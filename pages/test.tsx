
import { useTimer } from "reactjs-countdown-hook";

const Example = () => {

    const {
        isActive,
        counter,
        seconds,
        minutes,
        hours,
        days,
        pause,
        resume,
        reset,
    } = useTimer(120, handleTimerFinish);

    function handleTimerFinish() {
        alert("times up!");
    }

    return (
        <div>

            <div>{`${days} : ${hours} : ${minutes} : ${seconds}`}</div>
            <button onClick={() => (isActive ? pause() : resume())}>
                {isActive ? "Pause" : "Resume"}
            </button>
            <button onClick={reset}>Reset</button>

        </div>

    );

};

export default Example
