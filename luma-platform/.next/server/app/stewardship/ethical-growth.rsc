3:I[5613,[],""]
6:I[1778,[],""]
7:I[5250,["792","static/chunks/792-edf78b7a7b2e44f7.js","95","static/chunks/app/(main)/layout-d2d5f8efb59ced63.js"],""]
8:I[5578,["792","static/chunks/792-edf78b7a7b2e44f7.js","95","static/chunks/app/(main)/layout-d2d5f8efb59ced63.js"],"BottomNav"]
9:I[3402,["967","static/chunks/967-403a9f17f0dc18b2.js","185","static/chunks/app/layout-5d99b17105026e1e.js"],"SessionProvider"]
2:T2310,
<!-- Header Section with Forest Imagery Overlay -->
<section class="mb-section-gap text-center md:text-left relative overflow-hidden rounded-2xl p-8 md:p-12">
<div class="absolute inset-0 z-0">
<img alt="Mystical Forest" class="w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA77TS8uC1f0ghnG3LoTNiYc3ij6bikjw3eeFT3tubaTQcfP9d0opKPSGcHPgM0GIBwc1iBN3rLQGJ4VYefJ29iCdcqShbK0tZhO0_orzD--770wq7nZyvQ6Z2oH7Ub8mWQWQX_uho-nEVu0qaCnCSZtQctJbcrvrV4owtlVAAV3KMv9ssN1io2Ugnaw0fIeajAgzCeYQXm2T2Ym_dVXctthbigv79K_SFw-W64IIZTL9OrPhZCMEQM9KW0aHKc4RztzlPW96sLt1Cc"/>
<div class="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent"></div>
</div>
<div class="relative z-10">
<h1 class="font-display-lg text-display-lg mb-2 text-on-surface">Stewardship</h1>
<p class="text-on-surface-variant max-w-2xl">Manage your organizational commitments and outreach efforts with clarity and calm. Tools designed for ethical partnership and transparent escrow management.</p>
</div>
</section>
<!-- Tool Grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
<!-- Tool: Partner Outreach -->
<div class="glass-panel luma-glow rounded-xl p-8 transition-all duration-300">
<div class="flex items-start justify-between mb-6">
<div>
<div class="flex items-center gap-2 text-primary mb-1">
<span class="material-symbols-outlined">send_spark</span>
<span class="font-label-sm text-label-sm uppercase tracking-widest">Growth Engine</span>
</div>
<h2 class="font-headline-md text-headline-md">Partner Outreach</h2>
</div>
</div>
<div class="space-y-4 mb-8">
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant mb-2 block">PARTNER TYPE</label>
<select class="w-full bg-surface-container/50 border-none border-b border-outline focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all">
<option>Conservation Foundation</option>
<option>Ethical Tech Collective</option>
<option>Mental Health Nonprofit</option>
</select>
</div>
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant mb-2 block">OUTREACH TONE</label>
<div class="flex gap-2">
<button class="bg-primary/10 text-primary px-4 py-2 rounded-full font-label-sm text-label-sm active-glow">Empathetic</button>
<button class="bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">Visionary</button>
<button class="bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">Pragmatic</button>
</div>
</div>
</div>
<button class="primary-gradient text-on-primary-container w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-all shadow-lg action-shimmer" onclick="generateEmail()">
<span class="material-symbols-outlined">mail</span>
                Generate partner outreach email
            </button>
<div class="mt-8 hidden animate-in fade-in slide-in-from-bottom-4 duration-500" id="email-preview">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant">PREVIEW</span>
<button class="text-primary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
<span class="material-symbols-outlined text-sm">content_copy</span> Copy
                    </button>
</div>
<div class="bg-surface-container-lowest/80 p-6 rounded-lg font-body-md text-on-surface-variant leading-relaxed border border-white/5 whitespace-pre-line">
                    Dear [Partner Name],

                    We at LumaNation have been closely following your stewardship in the environmental sector. Our mission to create empathetic digital sanctuaries aligns deeply with your commitment to restorative ecological practices.

                    We are writing to propose a collaborative partnership that bridges human wellness with environmental resilience...
                </div>
</div>
</div>
<!-- Tool: Escrow Management -->
<div class="glass-panel luma-glow rounded-xl p-8 transition-all duration-300">
<div class="flex items-start justify-between mb-6">
<div>
<div class="flex items-center gap-2 text-tertiary mb-1">
<span class="material-symbols-outlined">verified_user</span>
<span class="font-label-sm text-label-sm uppercase tracking-widest">Trust Protocol</span>
</div>
<h2 class="font-headline-md text-headline-md">Escrow Document</h2>
</div>
</div>
<div class="space-y-4 mb-8">
<div class="grid grid-cols-2 gap-4">
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant mb-2 block">FUND ALLOCATION</label>
<input class="w-full bg-surface-container/50 border-none border-b border-outline focus:border-primary focus:ring-0 text-on-surface rounded-t-lg" placeholder="$10,000.00" type="text"/>
</div>
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant mb-2 block">RELEASE MILESTONE</label>
<input class="w-full bg-surface-container/50 border-none border-b border-outline focus:border-primary focus:ring-0 text-on-surface rounded-t-lg" placeholder="Project Phase 1" type="text"/>
</div>
</div>
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant mb-2 block">ESCROW AGENT</label>
<input class="w-full bg-surface-container/50 border-none border-b border-outline focus:border-primary focus:ring-0 text-on-surface rounded-t-lg" placeholder="Luma Governance DAO" type="text"/>
</div>
</div>
<button class="bg-surface-container-high border border-primary/30 text-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-all hover:bg-surface-container-highest action-shimmer" onclick="createDocument()">
<span class="material-symbols-outlined">description</span>
                Create mock escrow document
            </button>
<div class="mt-8 hidden animate-in fade-in slide-in-from-bottom-4 duration-500" id="doc-preview">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant">LEGAL DRAFT PREVIEW</span>
<button class="text-primary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
<span class="material-symbols-outlined text-sm">download</span> Download PDF
                    </button>
</div>
<div class="bg-surface-container-lowest/80 p-6 rounded-lg font-mono text-[13px] text-on-surface-variant/80 border border-white/5 h-48 overflow-y-auto leading-6">
                    [ESCROW AGREEMENT v1.2]
                    Date: October 24, 2023
                    Parties: LumaNation Stewardship Council &amp; [Partner]

                    1. DEFINITIONS: "Funds" shall refer to the digital assets held in the Luma Trust Ledger...
                    2. DISBURSEMENT: Assets are scheduled for release upon the verified completion of 'Project Phase 1' as audited by the Luma Governance DAO...
                    3. TERMINATION: This agreement remains binding until all milestones are met or a mutual cessation is recorded on the distributed ledger...
                </div>
</div>
</div>
</div>
<!-- Secondary Information Section -->
<section class="mt-section-gap grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="p-6 glass-panel rounded-xl">
<span class="material-symbols-outlined text-primary mb-4 block">diversity_3</span>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Stewardship Values</h3>
<p class="text-sm text-on-surface-variant">Every partnership outreach is measured against our core value of 'Deep Rooted Empathy'. We prioritize long-term ecological impact over short-term gains.</p>
</div>
<div class="p-6 glass-panel rounded-xl">
<span class="material-symbols-outlined text-primary mb-4 block">account_balance_wallet</span>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Fund Transparency</h3>
<p class="text-sm text-on-surface-variant">LumaNation maintains 100% transparency. Our escrow documents are publicly auditable and secured by cryptographic proofs of intent.</p>
</div>
<div class="p-6 glass-panel rounded-xl overflow-hidden relative">
<img alt="Forest Moss Texture" class="absolute inset-0 w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBG3bT2E6gCij4D-NCqhA0JCu_llOzdxkUe0OtZczKapzGGHbkA91gcAFVXL4JTrfCjOpYmhMJWUhHkZqfZYY3lzBVxyuRf3MK3qkkzc-QY-rXhz8qRtdy2iTR5BQlg6-Ec_63RO98p-oSB9mkv9PTw-QNTswML2UvBxiYqUe4hAHYM6bKneyp8aW_Ts9U665WomowaMpuKPAkWg9XucsRRwQa17amHXtw_WOzJTYD54hTQea4kiDONXuGE1ruczN8Mt55rVpyBVeH"/>
<div class="relative z-10">
<span class="material-symbols-outlined text-primary mb-4 block">shield_with_heart</span>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Ethical Guardrails</h3>
<p class="text-sm text-on-surface-variant">Tools here are governed by our AI Ethics board, ensuring all generated content remains respectful and aligned with human flourishing.</p>
</div>
</div>
</section>
4:["section","stewardship","d"]
5:["variant","ethical-growth","d"]
a:{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"}
b:{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"}
c:{"display":"inline-block"}
d:{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0}
0:["tM9PWYgm2wO6GBtkyUt45",[[["",{"children":["(main)",{"children":[["section","stewardship","d"],{"children":[["variant","ethical-growth","d"],{"children":["__PAGE__?{\"section\":\"stewardship\",\"variant\":\"ethical-growth\"}",{}]}]}]}]},"$undefined","$undefined",true],["",{"children":["(main)",{"children":[["section","stewardship","d"],{"children":[["variant","ethical-growth","d"],{"children":["__PAGE__",{},["$L1",["$","article",null,{"className":"max-w-7xl mx-auto animate-fade-in-up","children":[["$","h1",null,{"className":"font-headline-lg text-headline-lg text-primary font-bold mb-6","children":"LumaNation | Stewardship"}],["$","div",null,{"dangerouslySetInnerHTML":{"__html":"$2"},"className":"legacy-content space-y-6"}]]}],null]]},["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","(main)","children","$4","children","$5","children"],"loading":"$undefined","loadingStyles":"$undefined","loadingScripts":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L6",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}]]},["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","(main)","children","$4","children"],"loading":"$undefined","loadingStyles":"$undefined","loadingScripts":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L6",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}]]},[null,["$","div",null,{"className":"min-h-screen bg-surface text-on-surface luma-gradient-bg","children":[["$","header",null,{"className":"fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 h-16","children":["$","div",null,{"className":"flex items-center justify-between px-container-margin h-full max-w-7xl mx-auto","children":[["$","$L7",null,{"href":"/","className":"flex items-center gap-3","children":[["$","div",null,{"className":"w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-surface-container flex items-center justify-center","children":["$","span",null,{"className":"text-primary font-bold font-headline-md","children":"L"}]}],["$","h1",null,{"className":"font-headline-md text-headline-md font-bold tracking-tight text-primary","children":"LumaNation"}]]}],["$","button",null,{"aria-label":"Settings","className":"text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 duration-200 p-2 rounded-full hover:bg-surface-container-high","children":["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":20,"height":20,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-settings ","children":[["$","path","1qme2f",{"d":"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}],["$","circle","1v7zrd",{"cx":"12","cy":"12","r":"3"}],"$undefined"]}]}]]}]}],["$","main",null,{"className":"pt-24 pb-32 px-container-margin max-w-7xl mx-auto","children":["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","(main)","children"],"loading":"$undefined","loadingStyles":"$undefined","loadingScripts":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L6",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[],"styles":null}]}],["$","$L8",null,{}]]}],null]]},[null,["$","html",null,{"lang":"en","className":"dark","children":["$","body",null,{"className":"__variable_73ee6c __variable_3c557b min-h-screen bg-surface text-on-surface antialiased","children":["$","$L9",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children"],"loading":"$undefined","loadingStyles":"$undefined","loadingScripts":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L6",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":"$a","children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":"$b","children":"404"}],["$","div",null,{"style":"$c","children":["$","h2",null,{"style":"$d","children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[],"styles":null}]}]}]}],null]],[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/37302d928020bbf8.css","precedence":"next","crossOrigin":""}]],"$Le"]]]]
e:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"LumaNation | Private Life Navigation"}],["$","meta","3",{"name":"description","content":"A completely private, anonymous space to unpack your thoughts and navigate life's heavy days. No records kept."}]]
1:null
