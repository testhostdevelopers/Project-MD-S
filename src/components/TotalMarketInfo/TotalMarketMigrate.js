import React from 'react'

const index = () => {
    return (
        <div className="col-sm-12 mb-4 new-data">
            <div className="row">
                <div className="col-sm-12 col-lg-3 mb-4">
                    <div className="gray-bg p-3 bg-card-left">
                        <div className="mb-3">
                            <p>Total market size</p>
                            <h5><b>$5,231,468,525.00</b></h5>
                        </div>

                        <div>
                            <p>Total platform fees</p>
                            <h5><b>$1,468,525.00</b></h5>
                        </div>
                    </div>
                </div>

                <div className="mb-4 col-sm-12 col-lg-6">
                    <div className="gray-bg p-3 d-flex justify-content-between bg-card-center">
                        <div>
                            <div className="mb-3">
                                <p>MsDoge cap</p>
                                <div className="d-flex">
                                    <h5><b>$10.5<sub style={{ bottom: "0" }}>M</sub></b> </h5>
                                </div>
                            </div>

                            <div>
                                <p>MsDoge Price</p>
                                <div className="d-flex">
                                    <h5><b>$10.5<sub style={{ bottom: "0" }}>M</sub></b> </h5>
                                </div>
                            </div>
                        </div>


                        <div>
                            <div className="mb-3">
                                <p>MsDoge Staked</p>
                                <div className="d-flex">
                                    <h5><b>10.5<sub style={{ bottom: "0" }}>M</sub></b> </h5>
                                    <small style={{ marginLeft: "25px" }}>$ 12.45M USD</small>
                                </div>
                            </div>
                        </div>


                        <div>
                            <div className="mb-3">
                                <p>Circulating supply</p>
                                <div className="d-flex">
                                    <h5><b>25.5<sub style={{ bottom: "0" }}>M</sub></b> </h5>
                                    <small style={{ marginLeft: "25px" }}>40.5% LOCKED</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 col-sm-12 col-lg-3" style={{paddingRight: "0"}}>
                    <div className="gray-bg p-3 d-flex justify-content-between bg-card-right">
                        <div>
                            <div className="mb-3">
                                <p>Market cap</p>
                                <div className="d-flex">
                                    <h5><b>$10.5<sub style={{ bottom: "0" }}>M</sub></b> </h5>
                                </div>
                            </div>

                            <div>
                                <p>Loria Price</p>
                                <div className="d-flex">
                                    <h5><b>$1.18</b></h5>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-3">
                                <p>Circulating supply</p>
                                <div className="d-flex">
                                    <h5><b>$25.5<sub style={{ bottom: "0" }}>M</sub></b> </h5>
                                    <small style={{ marginLeft: "25px" }}>40.5% LOCKED</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default index