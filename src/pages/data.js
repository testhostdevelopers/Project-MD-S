import Footer from '../components/layout/Footer';
import Navbar from "../components/layout/Navbar";
import LineChart from "../components/Charts/Line";
import MultiLine from "../components/Charts/MultiLine";
import VerticalBar from "../components/Charts/VerticalBar";

export default function Data() {

    return (
        <>
            <Navbar />
            <div className="coin-main py-60 ms">
                <div className="container-lg">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        MsDoge Total Value Deposited
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <LineChart type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        Cryptoloria Total Value Deposited
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <LineChart type="yellow" />
                            </div>
                        </div>


                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        MsDoge Market Value if Treasury Assets
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <MultiLine type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        Cryptoloria Market Value if Treasury Assets
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <MultiLine type="yellow" />
                            </div>
                        </div>


                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        MsDoge Market Risk Freee Value if Treasury Assets
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <MultiLine type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        Cryptoloria Market Risk Freee Value if Treasury Assets
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <MultiLine type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        MsDoge Protocol Owned Liquidity OHM-DAI
                                    </h4>
                                    <div className="price"><b>78.92%</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <LineChart type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                        Cryptoloria Protocol Owned Liquidity OHM-DAI
                                    </h4>
                                    <div className="price"><b>78.92%</b></div>
                                    <div className="date mb-3">Today</div>

                                </div>
                                <LineChart type="yellow" />
                            </div>
                        </div>

                        

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                    MsDoge Staked
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">$7.89b</div>

                                </div>
                                <VerticalBar type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                    Cryptoloria Staked
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">$7.89b</div>

                                </div>
                                <VerticalBar type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                    MsDoge Runway Available
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">308 Days</div>

                                </div>
                                <MultiLine type="yellow" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <div className="line-graph">
                                <div className="token-graph">
                                    <h4>
                                    Cryptoloria Runway Available
                                    </h4>
                                    <div className="price"><b>$2,653,294,249</b></div>
                                    <div className="date mb-3">308 Days</div>

                                </div>
                                <MultiLine type="yellow" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
