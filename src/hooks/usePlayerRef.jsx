import { useRef } from "react"


const usePlayerRefData = () => {
    const GK_Ref = useRef(null);
    const LWB_Ref = useRef(null);
    const RWB_Ref = useRef(null);
    const LCB_Ref = useRef(null);
    const RCB_Ref = useRef(null);
    const LCMF_Ref = useRef(null);
    const RCMF_Ref = useRef(null);
    const LWF_Ref = useRef(null);
    const RWF_Ref = useRef(null);
    const LF_Ref = useRef(null);
    const RF_Ref = useRef(null);

    const matchPatternArray1 = [
        { ref: GK_Ref }, { ref: LWB_Ref }, { ref: RWB_Ref }, { ref: LCB_Ref }, { ref: RCB_Ref }, { ref: LCMF_Ref },
        { ref: RCMF_Ref }, { ref: LWF_Ref }, { ref: RWF_Ref }, { ref: LF_Ref }, { ref: RF_Ref },
    ];

    return matchPatternArray1;
}

export default usePlayerRefData;