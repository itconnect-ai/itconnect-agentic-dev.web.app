'use strict';
// SVG line icons follow the Lucide icon vocabulary (ISC license).
const ICON_PATHS = {
  'arrow-right': '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5m6-6-6 6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  'rotate-ccw': '<path d="M3 10a9 9 0 1 1 2.6 8.3M3 4v6h6"/>',
  'layout-dashboard':
    '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  layers: '<path d="m12 3 10 6-10 6L2 9Zm-10 12 10 6 10-6M2 12l10 6 10-6"/>',
  'git-branch':
    '<path d="M6 3v12a6 6 0 0 0 12 0V9"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/>',
  'git-compare':
    '<circle cx="6" cy="6" r="3"/><path d="M6 9v12M18 3v12"/><circle cx="18" cy="18" r="3"/><path d="m11 6 3 3-3 3m3-3H9m4 3-3 3 3 3m-3-3h5"/>',
  'scan-line': '<path d="M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M4 12h16"/>',
  'panel-top': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M7 6h.01M10 6h.01"/>',
  'shield-check': '<path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7Z"/><path d="m8 12 3 3 5-6"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  'circle-alert': '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
  'list-checks': '<path d="m3 6 2 2 3-4m3 3h10M3 12h5m3 0h10M3 18h5m3 0h10"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  maximize: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  minimize: '<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
};
const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.code}</svg>`;
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const cloneSamples = () => PROJECT_SPEC.initialRoutines.map((item) => ({ ...item }));
const getRate = (items) =>
  items.length ? Math.round((items.filter((item) => item.completed).length / items.length) * 100) : 0;
const STAGE = Object.freeze({
  planning: 1,
  functions: 2,
  architecture: 3,
  design: 4,
  build: 5,
  review: 6,
  product: 7,
});
const TOTAL_STAGES = PROJECT_SPEC.stages.length;
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
}
function stageHeading(n) {
  const stage = PROJECT_SPEC.stages[n - 1];
  return `<div class="stage-heading"><div><div class="eyebrow"><span class="step-index">${stage.number}</span> ${stage.english}</div><h1 id="stageTitle${n}" tabindex="-1">${stage.title}</h1><p>${stage.description}</p></div><span class="stage-fraction">${stage.number}<span> / ${String(TOTAL_STAGES).padStart(2, '0')}</span></span></div>`;
}
function modelLogo(name) {
  const brand = name.startsWith('Claude') ? 'claude' : name.startsWith('GPT') ? 'openai' : 'gemini';
  return `<img class="model-logo" src="assets/models/${brand}.svg" alt="" aria-hidden="true" width="24" height="24">`;
}
function agentChip(name, role = '담당') {
  return `<span class="agent-chip"><span class="agent-mark model-mark">${modelLogo(name)}</span><span><small>${role}</small><strong>${name}</strong></span></span>`;
}
function ringSVG(rate, extra = '') {
  return `<svg class="rate-ring ${extra}" viewBox="0 0 88 88" aria-hidden="true"><circle class="ring-track" cx="44" cy="44" r="35"/><circle class="ring-value" cx="44" cy="44" r="35" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - rate}"/><path class="ring-tick" d="m34 44 7 7 14-15"/></svg>`;
}
function miniApp({ home = false } = {}) {
  return `<div class="mini-app ${home ? 'mini-home' : ''}" aria-label="하루루틴 화면 미리보기"><div class="mini-titlebar"><span class="mini-logo">h.</span><strong>하루루틴</strong><span class="mini-url">haruroutine.app</span>${icon('panel-top')}</div><div class="mini-body">
  ${home ? `<aside class="mini-sidebar"><span class="mini-user">MY WORKSPACE</span><span class="mini-side-active">${icon('calendar')} 오늘의 루틴</span><span>${icon('list-checks')} 모든 루틴</span><div class="mini-side-divider"></div><small>매일, 조금씩 더 나은 하루.</small></aside>` : ''}
  <div class="mini-workspace"><div class="mini-app-heading"><span>MY DAILY ROUTINE</span><strong>오늘도, 하나씩 해내요.</strong></div><div class="mini-summary"><span class="wire-label">01 · 요약 보드</span><div><span class="mini-summary-label">오늘의 달성률</span><div class="mini-rate">75<span>%</span></div><small>4개의 루틴 중 <b>3개 완료</b></small></div><div class="mini-ring">${ringSVG(75)}</div><div class="mini-bar"><span></span></div></div>
  <div class="mini-input"><span class="wire-label">02 · 루틴 입력창</span><span class="mini-input-placeholder">새로운 루틴을 입력하세요</span><span class="mini-add">${icon('plus')}</span></div><div class="mini-review-warning">${icon('circle-alert')} 할 일 제목을 입력해 주세요.<span class="review-pin">리뷰 반영</span></div><div class="mini-tabs"><span class="wire-label">03 · 카테고리 필터</span><span class="selected">전체 <b>4</b></span><span>업무</span><span>건강</span><span>자기계발</span></div><div class="mini-list"><span class="wire-label">04 · 할 일 목록</span>${PROJECT_SPEC.initialRoutines.map((item) => `<div class="mini-row ${item.completed ? 'is-done' : ''}"><span class="mini-checkbox">${item.completed ? icon('check') : ''}</span><span class="mini-row-title">${item.title}</span><small>${item.category}</small><span class="mini-delete">${icon('trash')}</span></div>`).join('')}</div></div></div></div>`;
}
function workFocus(n, model, action, steps) {
  return `<div class="work-focus" data-focus-stage="${n}"><div class="work-live"><span class="live-orbit continuous-motion"></span><span>지금 진행 중</span></div><div class="focus-model" id="focusModel${n}">${agentChip(model, '현재 담당')}</div><div class="focus-description"><strong id="focusAction${n}">${action}</strong><span id="focusTarget${n}">진하게 표시된 곳의 변화를 따라가세요.</span></div><div class="focus-progress"><strong id="focusPercent${n}">0<span>%</span></strong><span class="focus-progress-track"><span id="focusFill${n}"></span></span></div></div><ol class="story-steps" data-story-steps="${n}" style="--story-step-count:${steps.length}">${steps.map((s, i) => `<li data-story-step="${i + 1}" class="${i === 0 ? 'active' : ''}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${s}</strong><i></i></li>`).join('')}</ol>`;
}
function typedRow(text, index) {
  return `<div class="document-row" data-type-text="${escapeHTML(text)}"><span class="document-row-index">0${index + 1}</span><p><span class="typed-copy"></span><span class="typing-caret continuous-motion"></span><span class="untyped-copy" aria-hidden="true">${escapeHTML(text)}</span></p></div>`;
}
function typedCopy(text) {
  return `<span class="typed-copy"></span><span class="typing-caret continuous-motion"></span><span class="untyped-copy" aria-hidden="true">${escapeHTML(text)}</span>`;
}
function documentInput(n) {
  const inputs = {
    1: {
      label: 'START · 내가 보낸 요청',
      title: '한 줄의 아이디어',
      text: '',
      tags: ['하루루틴 제작 요청'],
      next: '요청을 읽고 기획안으로 정리합니다.',
    },
    2: {
      label: 'INPUT · 이전 과정의 결과',
      title: '하루루틴 기획안',
      text: '개인 사용자가 하루의 할 일을 관리하고, 오늘의 달성률을 확인하는 웹 프로그램.',
      tags: ['목표', '대상자', '만들 것'],
      next: '이 기획을 실제 기능으로 나눕니다.',
    },
    3: {
      label: 'INPUT · 이전 과정의 결과',
      title: '하루루틴 기능정의서',
      text: '루틴 등록, 완료 체크·달성률, 카테고리 필터, 루틴 삭제, 자동 저장.',
      tags: ['기능 5개', '동작 기준 확정'],
      next: '기능을 구현할 기술과 연결 구조를 정합니다.',
    },
  };
  const input = inputs[n];
  return `<aside class="document-input-rail" ${n === 1 ? 'id="planningInputRail"' : ''}><div class="document-input-label">${icon(n === 1 ? 'arrow-up-right' : 'file-text')}<small>${input.label}</small></div><h2>${input.title}</h2><p class="document-input-preview" ${n === 1 ? 'id="requestEcho"' : ''}>${input.text}</p><div class="document-input-tags">${input.tags.map((t) => `<span>${t}</span>`).join('')}</div><div class="prompt-delivery"><span class="delivery-line"></span><span class="delivery-packet continuous-motion"></span>${icon('arrow-right')}</div><span class="document-handoff-note">${input.next}</span></aside>`;
}
function preparationDocument(id, title, question, body, outcome) {
  return `<article class="artifact-document preparation-document" id="${id}" data-state="waiting"><div class="document-titlebar"><span class="document-file-icon">${icon('file-text')}</span><div><small>${question}</small><h2>${title}</h2></div><span class="document-state">작성 대기</span></div>${body}<div class="document-deliverable">${icon('check')}${outcome}</div></article>`;
}
function planningTemplate() {
  const body = `<div class="document-sheet preparation-sheet"><div class="document-intro"><span class="document-kicker">왜, 누구를 위해, 무엇을 만들까요?</span><h2>만들기 전에, 방향부터 분명하게.</h2></div><div class="document-parts">${PROJECT_SPEC.brief.map((field, i) => `<section class="document-part" data-document-part="${i}" data-type-text="${escapeHTML(field.text)}"><span class="document-part-index">0${i + 1}</span><div class="document-part-copy"><h3>${field.label}</h3><p>${typedCopy(field.text)}</p></div></section>`).join('')}</div></div>`;
  return `${stageHeading(1)}${workFocus(1, 'Claude Opus 5.5', '요청을 읽고, 만들 방향을 정리합니다.', ['요청 읽기', '목표·대상 정리', '만들 것 확정'])}<div class="document-stage">${documentInput(1)}${preparationDocument('planDocument', '하루루틴 기획안', '어떤 문제를, 누구를 위해 해결할까요?', body, '목표·대상자·만들 결과물이 정리됐습니다.')}</div><div class="stage-result" id="planResult">${icon('file-text')}<span>기획안 작성</span><strong>요청 한 줄 → 목표·대상자·만들 것 → 기능정의 과정으로 전달</strong></div>`;
}
function functionalTemplate() {
  const body = `<div class="document-sheet preparation-sheet"><div class="document-intro"><span class="document-kicker">사용자가 이렇게 하면, 프로그램은 이렇게.</span><h2>하루루틴이 해야 할 다섯 가지 일.</h2></div><div class="feature-definition-table" role="table" aria-label="핵심 기능 5개"><div class="feature-definition-head" role="row"><span role="columnheader">기능</span><span role="columnheader">사용자 행동</span><span role="columnheader">프로그램의 반응</span></div>${PROJECT_SPEC.features.map((feature, i) => `<div class="feature-definition-row" data-feature="${i}" role="row"><div class="feature-name" role="cell"><span>F0${i + 1}</span><strong>${feature.name}</strong></div><span class="feature-trigger" role="cell">${feature.trigger}</span><p class="feature-response" data-type-text="${escapeHTML(feature.response)}" role="cell">${typedCopy(feature.response)}</p></div>`).join('')}</div><div class="feature-contract-note"><span>${icon('shield-check')} 빈 제목은 등록 차단</span><span>${icon('shield-check')} 할 일이 0개면 달성률 0%</span></div></div>`;
  return `${stageHeading(2)}${workFocus(2, 'Claude Opus 5.5', '기획안을 받아, 필요한 기능을 나눕니다.', ['기획안 인수', '기능 5개 정의', '동작 기준 확정'])}<div class="document-stage">${documentInput(2)}${preparationDocument('functionDocument', '하루루틴 기능정의서', '어떤 행동에, 어떻게 동작해야 할까요?', body, '기능 5개와 각각의 동작 기준이 정해졌습니다.')}</div><div class="stage-result" id="functionResult">${icon('list-checks')}<span>기능정의서 작성</span><strong>기획안 → 기능 5개와 동작 기준 → 설계 과정으로 전달</strong></div>`;
}
function architectureTemplate() {
  const body = `<div class="technical-document-body"><section class="tech-stack-panel document-part" data-design-part="0"><h3><span>01</span> 기술 스택</h3><div class="tech-stack-list"><div><strong>HTML</strong><span>화면의 구조</span></div><div><strong>CSS</strong><span>스타일·애니메이션</span></div><div><strong>JavaScript</strong><span>기능·계산·저장</span></div></div></section><section class="data-model-panel document-part" data-design-part="1"><h3><span>02</span> 데이터베이스·저장소</h3><div class="storage-choice">${icon('database')}<strong>LocalStorage</strong><span>루틴을 JSON 목록으로 저장</span></div><div class="data-fields"><span><code>id</code><small>고유 번호</small></span><span><code>title</code><small>할 일 제목</small></span><span><code>category</code><small>카테고리</small></span><span><code>completed</code><small>완료 여부</small></span></div><p class="storage-scope-note">이 시연은 별도 서버 데이터베이스 없이, 현재 브라우저의 저장소를 사용합니다.</p></section><section class="architecture-panel document-part" data-design-part="2"><h3><span>03</span> 아키텍처 · 세 계층의 연결</h3><div class="architecture-flow"><div class="architecture-node">${icon('panel-top')}<strong>화면 계층</strong><span>입력·체크·목록 표시</span></div><span class="architecture-arrow">${icon('arrow-right')}</span><div class="architecture-node">${icon('code')}<strong>기능·계산 계층</strong><span>입력 검증·달성률 계산</span></div><span class="architecture-arrow">${icon('arrow-right')}</span><div class="architecture-node">${icon('database')}<strong>저장 계층</strong><span>루틴 저장·불러오기</span></div></div><small class="architecture-feedback">사용자 조작 → 상태 변경·저장 → 계산 결과를 화면에 반영</small></section></div>`;
  return `${stageHeading(3)}${workFocus(3, 'Claude Opus 5.5', '기능정의서를 받아, 구현 구조를 정합니다.', ['기능정의 인수', '기술·저장 구조', '아키텍처 설계', '다른 모델 검증'])}<div class="document-stage">${documentInput(3)}${preparationDocument('designDocument', '하루루틴 설계안', '무슨 기술로, 어디에 저장하고, 어떻게 연결할까요?', body, '기술 스택·저장 구조·아키텍처를 개발 팀에 전달합니다.')}</div><article class="planning-check" id="planningCheck" data-state="waiting"><div class="planning-check-head">${agentChip('GPT-6.1-Sol', '설계안 교차 검증')}<div><strong>“아직 할 일이 0개라면?”</strong><span>설계한 계산 규칙의 예외를 확인합니다.</span></div><span class="check-state" id="planningCheckState">검증 대기</span></div><div class="formula-comparison" id="formulaComparison"><div class="formula-cell before"><span>기존 계산</span><span class="formula-expression">0 ÷ 0 × 100</span><strong>NaN<span>%</span></strong><span class="formula-outcome">숫자로 표시할 수 없음</span></div><span class="formula-arrow">${icon('arrow-right')}</span><div class="formula-cell after"><span>안전 조건 추가</span><span class="formula-expression">할 일 0개면 → 0%</span><strong>0<span>%</span></strong><span class="formula-outcome">빈 목록도 정상 표시</span></div></div><div class="validation-note" id="formulaNote">${icon('scan-line')}<span>설계안을 작성한 뒤 계산 규칙을 검증합니다.</span></div></article><div class="stage-result" id="architectureResult">${icon('git-branch')}<span>설계안 작성</span><strong>기능정의서 → 구현 구조 설계 → 교차 검증 → 디자인·개발 팀에 전달</strong></div>`;
}

function designTemplate() {
  return `${stageHeading(STAGE.design)}${workFocus(STAGE.design, 'Gemini 4 Argon', '설계안을 받아, 첫 번째 레이어를 만듭니다.', ['뼈대 배치', '내용 채우기', '스타일 적용', '사용성 리뷰'])}<div class="design-grid"><aside class="design-steps"><div class="design-agent">${agentChip('Gemini 4 Argon', '화면을 만드는 AI')}<span class="sidebar-section-title">화면이 완성되는 순서</span></div>${PROJECT_SPEC.designLayers.map((layer, i) => `<button class="layer-button ${i === 0 ? 'active' : ''}" data-layer="${i + 1}" aria-pressed="${i === 0}"><span class="layer-number">0${i + 1}</span><span class="layer-description"><span class="layer-active-label">지금 이 작업</span><strong>${layer.title}</strong><span>${layer.subtitle}</span><small>${layer.detail}</small><span class="layer-time-track"><i></i></span></span><span class="layer-check">${icon('check')}</span></button>`).join('')}<div class="layer-reviewer">${modelLogo('Claude Opus 5.5')}<span>다른 모델의 눈으로 한 번 더.<strong>Claude Opus 5.5 사용성 리뷰</strong></span></div></aside><article class="panel canvas-panel"><div class="canvas-toolbar"><span><span class="status-dot"></span> 여기가 바뀌고 있어요</span><strong id="layerCount">1 / 4</strong><span id="layerModel">${modelLogo('Gemini 4 Argon')} Gemini 4 Argon</span></div><div class="design-canvas" id="designCanvas" data-layer="1"><div class="canvas-annotation" id="canvasAnnotation"><span class="annotation-dot continuous-motion"></span><strong id="canvasAnnotationText">화면의 네 구역을 배치합니다</strong></div>${miniApp()}<div class="canvas-cursor continuous-motion">${icon('arrow-up-right')}<span id="canvasCursorLabel">Gemini</span></div></div><div class="canvas-change"><span class="outline-tag" id="layerTag">1층 · 와이어프레임</span><strong id="layerChange">화면의 자리부터 잡습니다</strong><span id="layerReviewCount"></span></div></article></div>`;
}
function fragmentTemplate(i) {
  if (i === 0)
    return '<div class="fragment-summary"><span>오늘의 달성률<strong>75<small>%</small></strong></span><div class="fragment-bar"><span></span></div><small>완료 3 / 전체 4</small></div>';
  if (i === 1)
    return `<div class="fragment-input"><span>새 할 일 입력</span><span>${icon('plus')}</span></div>`;
  return `<div class="fragment-list"><span><i>${icon('check')}</i> 목표 공유하기</span><span><i></i> 내일 업무 정리</span></div>`;
}
function buildTemplate() {
  return `${stageHeading(STAGE.build)}${workFocus(STAGE.build, 'Claude Sonnet 5.5', '두 팀이 같은 순간에, 각자의 작업을 시작합니다.', ['두 팀 동시 시작', '각자 부품 제작', '하나의 앱으로 결합', '실제 동작 확인'])}<div class="parallel-start-label"><span class="simultaneous-icon">${icon('git-branch')}</span><strong>한 팀을 기다리지 않습니다.</strong><span>화면 팀과 기능 팀이 <b>같은 시간에</b> 작업합니다.</span><span class="parallel-clock"><i class="continuous-motion"></i><span id="parallelElapsed">00:00</span> 같은 작업 시간</span></div><div class="parallel-workspace" id="parallelWorkspace">
    <article class="parallel-lane" id="frontendLane"><header><span class="lane-label">A · 화면을 만드는 팀</span>${agentChip('Claude Sonnet 5.5', '주력 에이전트')}<div class="lane-worker">${modelLogo('GPT-6.1-Sol')}<span>보조 워커 <strong>GPT-6.1-Sol</strong></span><span class="working-dot continuous-motion"></span></div></header><div class="lane-progress"><span><i id="frontendLaneFill"></i></span><strong id="frontendPercent">0%</strong></div><p class="lane-current" id="frontendCurrent">요약 보드 만드는 중<span class="typing-dots continuous-motion">...</span></p><div class="lane-units">${PROJECT_SPEC.buildParts.map((part, i) => `<div class="lane-unit frontend-unit" id="feUnit${i}" data-unit="${i}"><div class="lane-unit-title"><strong>${part.ui}</strong><span class="unit-state">제작 대기</span></div><div class="unit-preview">${fragmentTemplate(i)}</div><div class="unit-meter"><i></i></div></div>`).join('')}</div><div class="lane-output"><span class="output-packet continuous-motion"></span>${icon('arrow-right')} 화면 부품 전달</div></article>
    <article class="parallel-lane" id="backendLane"><header><span class="lane-label">B · 기능을 만드는 팀</span>${agentChip('GPT-6.1-Sol', '주력 에이전트')}<div class="lane-worker">${modelLogo('Claude Sonnet 5.5')}<span>보조 워커 <strong>Claude Sonnet 5.5</strong></span><span class="working-dot continuous-motion"></span></div></header><div class="lane-progress"><span><i id="backendLaneFill"></i></span><strong id="backendPercent">0%</strong></div><p class="lane-current" id="backendCurrent">달성률 계산 만드는 중<span class="typing-dots continuous-motion">...</span></p><div class="lane-units">${PROJECT_SPEC.buildParts.map((part, i) => `<div class="lane-unit backend-unit" id="beUnit${i}" data-unit="${i}"><div class="lane-unit-title"><strong>${part.fn}</strong><span class="unit-state">제작 대기</span></div><div class="function-visual">${icon(['layout-dashboard', 'database', 'list-checks'][i])}<span>${['3개 완료 / 4개 루틴', '새 루틴 → 목록에 저장', '체크 → 상태 변경'][i]}</span><strong>${['75%', '저장됨', '갱신됨'][i]}</strong></div><div class="unit-meter"><i></i></div></div>`).join('')}</div><div class="lane-output"><span class="output-packet continuous-motion"></span>${icon('arrow-right')} 기능 모듈 전달</div></article>
    <article class="assembly-preview" id="assemblyPreview"><header><span class="lane-label">두 팀의 결과가 만나는 곳</span><h2>하나의 앱으로 합쳐집니다.</h2><span id="assemblyStatus">화면 + 기능을 기다리는 중</span></header><div class="assembly-window">${miniApp()}<div class="assembly-wait"><span class="assembly-orbit continuous-motion"></span><strong>두 팀이 작업하고 있어요.</strong><span>완성된 부품이 여기에 도착합니다.</span></div><div class="assembly-demo-pointer continuous-motion">${icon('arrow-up-right')}</div></div><div class="assembly-proof" id="assemblyProof"><span class="assembly-proof-icon">${icon('check')}</span><div><strong>체크하면 달성률이 바뀝니다.</strong><span>화면과 기능이 연결되면 직접 움직입니다.</span></div></div></article></div><div class="code-details parallel-code"><details><summary>${icon('code')} 화면 코드 <span>Claude Sonnet 5.5</span></summary><pre><code id="frontendCode"></code></pre></details><details><summary>${icon('code')} 기능 코드 <span>GPT-6.1-Sol</span></summary><pre><code id="backendCode"></code></pre></details></div><div class="stage-result" id="buildResult">${icon('git-branch')}<span>동시 개발 중</span><strong>서로 다른 작업을 동시에 만들고, 하나의 앱에서 연결합니다.</strong></div>`;
}
function reviewTemplate() {
  return `${stageHeading(STAGE.review)}${workFocus(STAGE.review, 'Claude Sonnet 5.5', '만든 모델이 아닌, 다른 모델이 앱을 시험합니다.', ['오류 재현', '코드 수정', '같은 행동 재검증', '회고에 규칙 저장'])}<div class="review-team-bar"><div><span class="micro-label">기능 코드를 만든 AI</span>${agentChip('GPT-6.1-Sol', '개발')}</div><div class="review-team-arrow">${icon('arrow-right')}<span>다른 모델에게 검증 요청</span></div><div class="reviewer-logos">${agentChip('Claude Sonnet 5.5', '공격 테스트')}${agentChip('Gemini 4 Argon', '교차 검증')}</div></div><div class="review-case-selector">${PROJECT_SPEC.defects.map((defect, i) => `<button class="review-case-button ${i === 0 ? 'active' : ''}" data-review-case="${i}" aria-pressed="${i === 0}"><span>CASE 0${i + 1}</span><strong>${i === 0 ? '처음 켜 보기' : '빈칸으로 등록하기'}</strong><span class="case-complete">${icon('check')}</span></button>`).join('')}<span id="defectCount">두 가지 상황을 실제 앱에서 시험합니다.</span></div>
    <div class="review-theatre"><article class="review-sandbox-panel"><div class="sandbox-toolbar"><span>${icon('panel-top')} 하루루틴 · 테스트 실행 화면</span><strong id="sandboxTestLabel">첫 실행 테스트</strong></div><div class="sandbox-action"><span class="action-cursor continuous-motion">${icon('arrow-up-right')}</span><strong id="sandboxAction">앱을 처음 켜 봅니다.</strong><span id="sandboxActionState">테스트 준비</span></div><div class="review-sandbox" id="reviewSandbox" data-case="0" data-state="ready"><div class="sandbox-app-head"><span class="mini-logo">h.</span><strong>하루루틴</strong><span>오늘의 루틴</span></div><div class="sandbox-screen"><div class="sandbox-stat"><span>오늘의 달성률</span><strong id="sandboxRate">—<small>%</small></strong><div class="sandbox-gauge"><i></i></div></div><div class="sandbox-input" id="sandboxInput"><span id="sandboxInputValue">새 할 일을 입력하세요</span><span class="sandbox-add">+ 등록</span></div><div class="sandbox-inline-warning" id="sandboxWarning">${icon('circle-alert')} 할 일 제목을 입력해 주세요.</div><div class="sandbox-rows" id="sandboxRows"><span class="sandbox-empty">등록한 루틴이 없습니다.</span></div><div class="sandbox-crash"><span>${icon('circle-alert')}</span><strong>앱이 멈췄습니다.</strong><p>저장된 목록이 없는데, 목록부터 읽으려 했어요.</p><code>Cannot read properties of null</code></div><div class="sandbox-loading"><span class="sandbox-loader continuous-motion"></span><span>처음 실행하는 중</span></div></div><div class="sandbox-result" id="sandboxResult">다른 모델이 사용자의 행동을 직접 따라 합니다.</div></div><div class="review-cause"><span>발견한 문제</span><strong id="reviewCause">저장된 내용이 없는 첫 실행도 정상 작동할까요?</strong></div></article>
    <div class="review-action-column"><article class="review-patch-panel"><div class="review-event-heading"><span class="phase-number">01</span><div><small id="reviewPhaseLabel">테스트 → 오류 발견</small><h2 id="reviewEventTitle">직접 실행해서 확인합니다.</h2></div></div><div class="review-event-model" id="reviewEventModel">${agentChip('Claude Sonnet 5.5', '오류 재현')}</div><div class="review-patch-cards">${PROJECT_SPEC.defects.map((defect, i) => `<div class="patch-card" data-patch="${i}" ${i === 0 ? '' : 'hidden'}><h3>${i === 0 ? '첫 실행에는 안전한 빈 목록 준비' : '저장하기 전에 공백부터 검사'}</h3><div class="code-diff before"><span>수정 전</span><code>${escapeHTML(defect.before)}</code></div><div class="code-diff after"><span>수정 후</span><code>${escapeHTML(defect.after)}</code></div><span class="patch-state">오류가 확인되면 수정합니다.</span></div>`).join('')}</div><div class="review-retest" id="reviewRetest">${icon('rotate-ccw')} 같은 조작으로 한 번 더 확인합니다.</div></article>
    <article class="review-retro-panel"><div class="retro-document-label">${icon('file-text')}<strong>에이전트 팀 회고록</strong><span>다음 작업에 남길 규칙</span></div>${PROJECT_SPEC.defects.map((defect, i) => `<div class="retro-rule" data-retro="${i}"><span class="rule-arrival">${icon('arrow-right')}</span><div><span>RULE 0${i + 1}</span><h3>${defect.rule}</h3><p>${defect.ruleDetail}</p></div><span class="rule-saved">${icon('check')}</span></div>`).join('')}<div class="retro-stamp" id="retroStamp">문제를 해결한 뒤 규칙을 기록합니다.</div></article></div></div><div class="stage-result" id="reviewResult">${icon('scan-line')}<span>검증 중</span><strong>오류가 나는 장면 → 고친 코드 → 정상 동작 → 회고에 기록</strong></div>`;
}

function productTemplate() {
  const date = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).format(
    new Date(),
  );
  return `${stageHeading(STAGE.product)}<div class="product-context"><span>${icon('shield-check')} 빈 목록 안전 계산 · 빈칸 입력 차단 적용</span><div><button class="text-button" data-go="4">디자인 과정</button><button class="text-button" data-go="6">검증 과정</button></div></div><div class="product-frame"><div class="product-titlebar"><span class="window-dots"><i></i><i></i><i></i></span><span>${icon('shield-check')} haruroutine.app</span><span>HaruRoutine 1.0</span></div><div class="product-shell" id="haruProductRoot">
  <aside class="product-sidebar"><div class="product-brand"><span>h.</span><strong>하루루틴<small>HARU ROUTINE</small></strong></div><div class="workspace-label">PERSONAL WORKSPACE</div><div class="product-side-current">${icon('calendar')} 오늘의 루틴 <span id="sideTotal">4</span></div><div class="product-side-categories"><span>카테고리</span>${PROJECT_SPEC.categories
    .slice(1)
    .map((cat) => `<button data-filter="${cat}"><i></i>${cat}<span data-side-count="${cat}"></span></button>`)
    .join(
      '',
    )}</div><div class="product-side-note"><span class="sidebar-rule"></span><strong>작은 실행이 쌓이는 곳.</strong><p>오늘 할 수 있는 일부터<br>하나씩 완성해 보세요.</p></div></aside>
  <section class="product-main" aria-label="오늘의 루틴 관리"><div class="product-main-heading"><div><p>${date}</p><h2>오늘의 루틴<span class="small-dot">.</span></h2></div><button class="text-button sample-reset" id="sampleResetBtn">예시 데이터로 되돌리기</button></div><div class="product-summary"><div><span class="product-summary-eyebrow">조금씩, 꾸준히. 잘하고 있어요.</span><div class="product-stat-line"><strong id="hpRate">75<span>%</span></strong><div><span>오늘의 달성률</span><small id="hpStat">4개 중 3개 완료</small></div></div><div class="product-gauge" role="progressbar" aria-label="전체 루틴 달성률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" id="hpGauge"><span id="hpGaugeFill"></span></div></div><div class="product-ring">${ringSVG(75)}<span id="hpRingText">3 / 4</span></div></div>
  <form class="product-input-form" id="routineForm" novalidate><label class="sr-only" for="hpTitleInput">새 루틴 제목</label><input id="hpTitleInput" maxlength="120" autocomplete="off" placeholder="오늘, 어떤 일을 해낼까요?" aria-describedby="hpAlertBox"><label class="sr-only" for="hpCatSelect">루틴 카테고리</label><select id="hpCatSelect">${PROJECT_SPEC.categories
    .slice(1)
    .map((cat) => `<option>${cat}</option>`)
    .join(
      '',
    )}</select><button class="primary-button" type="submit" id="hpAddBtn">${icon('plus')} 루틴 추가</button></form><div class="input-warning" id="hpAlertBox" role="alert" hidden>${icon('circle-alert')}<span>할 일 제목을 입력해 주세요. 공백만으로는 등록할 수 없습니다.</span></div>
  <div class="product-list-toolbar"><div class="product-tabs" id="hpTabs" role="group" aria-label="카테고리 필터"></div><span id="hpRemaining"></span></div><ul class="product-list" id="hpList" aria-label="루틴 목록"></ul><div class="product-bottom-line"><span id="productSaveNote">${icon('check')} 이 브라우저에 자동 저장됩니다</span><span>오늘의 작은 성취를 기록하세요.</span></div></section></div></div><div class="try-it-note"><span class="eyebrow">TRY IT YOURSELF</span><span><b>01</b> 체크해서 달성률 바꾸기</span><span><b>02</b> 카테고리로 분류하기</span><span><b>03</b> 빈칸으로 등록해 경고 보기</span></div>`;
}

class AgenticStudioController {
  constructor() {
    this.currentStage = 0;
    this.speed = 1;
    this.isRunning = false;
    this.isPaused = false;
    this.runToken = 0;
    this.completed = new Set();
    this.activeCategory = '전체';
    this.storageAvailable = true;
    this.routines = this.loadItems();
    this.request = $('#projectPrompt').value.trim();
    this.renderScreens();
    this.bindEvents();
    this.renderProduct();
    this.setDesignLayer(1, false);
    this.updatePlayback();
  }
  loadItems() {
    let raw;
    try {
      raw = localStorage.getItem(PROJECT_SPEC.storageKey);
    } catch (_) {
      this.storageAvailable = false;
      return cloneSamples();
    }
    try {
      if (raw === null) return cloneSamples();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return cloneSamples();
      const ids = new Set();
      return parsed
        .filter((item) => {
          if (
            !item ||
            typeof item.id !== 'string' ||
            ids.has(item.id) ||
            typeof item.title !== 'string' ||
            !item.title.trim() ||
            !PROJECT_SPEC.categories.slice(1).includes(item.category) ||
            typeof item.completed !== 'boolean'
          )
            return false;
          ids.add(item.id);
          return true;
        })
        .map((item) => ({
          id: item.id,
          title: item.title.trim().slice(0, 120),
          category: item.category,
          completed: item.completed,
        }));
    } catch (_) {
      return cloneSamples();
    }
  }
  persistItems() {
    try {
      localStorage.setItem(PROJECT_SPEC.storageKey, JSON.stringify(this.routines));
      this.storageAvailable = true;
    } catch (_) {
      this.storageAvailable = false;
    }
  }
  renderScreens() {
    $('#homePreview').innerHTML = miniApp({ home: true });
    $('#pipelineMap').innerHTML = PROJECT_SPEC.stages
      .map((stage, i) => {
        const names =
          stage.kind === 'build'
            ? ['Claude Sonnet 5.5', 'GPT-6.1-Sol']
            : stage.kind === 'review'
              ? ['Claude Sonnet 5.5', 'Gemini 4 Argon']
              : stage.kind === 'product'
                ? []
                : [stage.model];
        const models = names.length
          ? names
              .map((name) => `<span class="model-inline">${modelLogo(name)}<span>${name}</span></span>`)
              .join('')
          : '<span>HaruRoutine v1.0</span>';
        return `<button class="pipeline-step" data-go="${i + 1}"><span class="pipeline-top"><span class="pipeline-number">${stage.number}</span>${icon(stage.icon)}</span><strong>${stage.label}</strong><span class="pipeline-model">${models}</span><span class="pipeline-output">${stage.output}</span><span class="pipeline-link">살펴보기 ${icon('arrow-right')}</span></button>`;
      })
      .join('');
    [
      planningTemplate,
      functionalTemplate,
      architectureTemplate,
      designTemplate,
      buildTemplate,
      reviewTemplate,
      productTemplate,
    ].forEach((template, i) => {
      $(`#stage${i + 1}`).innerHTML = template();
    });
    $('#requestEcho').textContent = this.request;
    this.setupPresentationLayout();
    hydrateIcons();
  }
  setupPresentationLayout() {
    const header = $('.header-inner');
    header.append($('.process-nav'), $('.playback-controls'));
    $('#homeBrandBtn').title = '교육용 시뮬레이션 · 실제 AI 모델 호출 없음';

    const fullscreen = document.createElement('button');
    fullscreen.id = 'fullscreenBtn';
    fullscreen.className = 'icon-button';
    fullscreen.setAttribute('aria-label', '전체 화면으로 보기');
    fullscreen.title = '전체 화면';
    fullscreen.innerHTML = icon('maximize');
    fullscreen.hidden = typeof document.documentElement.requestFullscreen !== 'function';
    $('.playback-controls').append(fullscreen);

    const createInspector = (id, title) => {
      const dialog = document.createElement('dialog');
      dialog.id = id;
      dialog.className = 'inspector-dialog';
      dialog.setAttribute('aria-labelledby', `${id}Title`);
      dialog.innerHTML = `<div class="inspector-header"><h2 id="${id}Title">${title}</h2><button class="secondary-button" data-close-dialog="${id}">닫기 ${icon('x')}</button></div><div class="inspector-body"></div>`;
      document.body.append(dialog);
      return dialog;
    };
    const code = createInspector('codeDialog', '두 팀이 작성한 코드');
    code.querySelector('.inspector-body').append($('.parallel-code'));
    code.querySelectorAll('details').forEach((detail) => {
      detail.open = true;
    });
    const tools = document.createElement('div');
    tools.className = 'stage-tools';
    tools.innerHTML = `<button class="secondary-button" data-open-dialog="codeDialog">${icon('code')} 코드 보기</button>`;
    $(`#stage${STAGE.build} .stage-heading`).append(tools);

    const prompt = createInspector('promptDialog', '내가 보낸 요청 전문');
    const request = document.createElement('p');
    request.id = 'expandedRequest';
    prompt.querySelector('.inspector-body').append(request);
    const sourceDetails = document.createElement('button');
    sourceDetails.className = 'text-button source-detail-button';
    sourceDetails.dataset.openDialog = 'promptDialog';
    sourceDetails.textContent = '요청 전문';
    $('#planningInputRail').insertBefore(sourceDetails, $('#planningInputRail .prompt-delivery'));

    const origin = document.createElement('span');
    origin.className = 'review-origin';
    origin.title = '개발: GPT-6.1-Sol / 검증: Claude Sonnet 5.5 + Gemini 4 Argon';
    origin.innerHTML = `${modelLogo('GPT-6.1-Sol')}<span>GPT 코드</span>${icon('arrow-right')}${modelLogo('Claude Sonnet 5.5')}${modelLogo('Gemini 4 Argon')}<span>교차 검증</span>`;
    $('.review-case-selector').append(origin);

    for (let n = 1; n <= TOTAL_STAGES; n++) {
      const screen = $(`#stage${n}`);
      const content = [...screen.children].filter(
        (el) => !el.matches('.stage-heading, .work-focus, .story-steps, .stage-result'),
      );
      const workspace = document.createElement('div');
      workspace.className = 'stage-workspace';
      content.forEach((el) => workspace.append(el));
      screen.insertBefore(workspace, screen.querySelector('.stage-result'));
    }
  }
  isPresentationLayout() {
    return window.innerWidth >= 1000 && window.innerHeight >= 600;
  }
  openInspector(dialog) {
    if (dialog.id === 'promptDialog') $('#expandedRequest').textContent = this.request;
    dialog.playbackSnapshot = { token: this.runToken, resume: this.isRunning && !this.isPaused };
    if (dialog.playbackSnapshot.resume) {
      this.isPaused = true;
      this.updatePlayback();
    }
    try {
      dialog.showModal();
    } catch (_) {
      if (dialog.playbackSnapshot.resume) {
        this.isPaused = false;
        this.updatePlayback();
      }
      dialog.playbackSnapshot = null;
      $('#appAnnouncement').textContent = '이 브라우저에서 상세 창을 열 수 없습니다.';
    }
  }
  bindEvents() {
    $('#homeBrandBtn').addEventListener('click', () => this.goToStage(0));
    $$('.nav-item').forEach((btn) =>
      btn.addEventListener('click', () => this.goToStage(Number(btn.dataset.stage))),
    );
    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-go]');
      if (link) this.goToStage(Number(link.dataset.go));
      const open = event.target.closest('[data-open-dialog]');
      if (open) this.openInspector(document.getElementById(open.dataset.openDialog));
      const close = event.target.closest('[data-close-dialog]');
      if (close) document.getElementById(close.dataset.closeDialog).close();
    });
    $$('.inspector-dialog').forEach((dialog) =>
      dialog.addEventListener('close', () => {
        const snapshot = dialog.playbackSnapshot;
        if (snapshot?.resume && snapshot.token === this.runToken && this.isRunning) {
          this.isPaused = false;
          this.updatePlayback();
        }
        dialog.playbackSnapshot = null;
      }),
    );
    $('#fullscreenBtn').addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (_) {
        $('#appAnnouncement').textContent =
          '전체 화면을 열 수 없습니다. 브라우저의 전체 화면 기능을 사용해 주세요.';
      }
    });
    document.addEventListener('fullscreenchange', () => {
      const active = Boolean(document.fullscreenElement);
      $('#fullscreenBtn').innerHTML = icon(active ? 'minimize' : 'maximize');
      $('#fullscreenBtn').setAttribute('aria-label', active ? '전체 화면 종료' : '전체 화면으로 보기');
      $('#fullscreenBtn').title = active ? '전체 화면 종료' : '전체 화면';
    });
    $('#promptForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const request = $('#projectPrompt').value.trim();
      if (!request) {
        $('#projectPrompt').setCustomValidity('하루루틴 제작 요청을 입력해 주세요.');
        $('#projectPrompt').reportValidity();
        return;
      }
      this.request = request;
      $('#requestEcho').textContent = request;
      this.startFullSimulation();
    });
    $('#projectPrompt').addEventListener('input', () => $('#projectPrompt').setCustomValidity(''));
    $('#pauseBtn').addEventListener('click', () => {
      if (!this.isRunning) return;
      this.isPaused = !this.isPaused;
      this.updatePlayback();
    });
    $$('.speed-switch button').forEach((btn) =>
      btn.addEventListener('click', () => {
        this.speed = Number(btn.dataset.speed);
        document.body.style.setProperty('--playback-speed', this.speed);
        $$('.speed-switch button').forEach((button) => {
          const active = button === btn;
          button.classList.toggle('active', active);
          button.setAttribute('aria-pressed', String(active));
        });
      }),
    );
    $('#resetBtn').addEventListener('click', () => this.resetSimulation());
    $('#prevStageBtn').addEventListener('click', () => this.goToStage(Math.max(0, this.currentStage - 1)));
    $('#nextStageBtn').addEventListener('click', () =>
      this.goToStage(this.currentStage === STAGE.product ? 0 : this.currentStage + 1),
    );
    $('#replayStageBtn').addEventListener('click', () => this.goToStage(this.currentStage, true));
    $$('.layer-button').forEach((btn) =>
      btn.addEventListener('click', () => {
        this.stop();
        this.setDesignLayer(Number(btn.dataset.layer));
        this.setStatus('레이어를 선택해 화면의 변화를 비교해 보세요.');
      }),
    );
    $$('.review-case-button').forEach((btn) =>
      btn.addEventListener('click', async () => {
        this.stop();
        this.completed.delete(STAGE.review);
        const token = this.runToken;
        this.isRunning = true;
        this.updatePlayback();
        const success = await this.playReviewCase(Number(btn.dataset.reviewCase), token);
        if (success && token === this.runToken) {
          this.isRunning = false;
          if ($$('.review-case-button.is-complete').length === 2) {
            this.completed.add(STAGE.review);
            this.finishReview();
          }
          this.setStatus('선택한 상황의 오류 재현, 패치, 재검증, 회고 기록을 마쳤습니다.');
        }
      }),
    );
    $('#routineForm').addEventListener('submit', (event) => {
      event.preventDefault();
      this.addRoutine();
    });
    $('#hpTitleInput').addEventListener('input', () => {
      $('#hpAlertBox').hidden = true;
      $('#hpTitleInput').removeAttribute('aria-invalid');
    });
    $('#haruProductRoot').addEventListener('change', (event) => {
      const id = event.target.dataset.toggle;
      if (!id) return;
      const item = this.routines.find((item) => item.id === id);
      if (!item) return;
      item.completed = event.target.checked;
      this.commitProduct(
        `${item.title}, ${item.completed ? '완료' : '미완료'}. 달성률 ${getRate(this.routines)}퍼센트.`,
      );
      this.focusToggle(id);
    });
    $('#haruProductRoot').addEventListener('click', (event) => {
      const filter = event.target.closest('[data-filter]');
      if (filter) {
        this.activeCategory = filter.dataset.filter;
        this.renderProduct();
        const replacement = [...$$('#hpTabs [data-filter]')].find(
          (btn) => btn.dataset.filter === this.activeCategory,
        );
        replacement?.focus({ preventScroll: true });
      }
      const deleteBtn = event.target.closest('[data-delete]');
      if (deleteBtn) {
        const current = this.routines.find((item) => item.id === deleteBtn.dataset.delete);
        this.routines = this.routines.filter((item) => item.id !== deleteBtn.dataset.delete);
        this.commitProduct(`${current?.title || '루틴'} 삭제됨. 달성률 ${getRate(this.routines)}퍼센트.`);
        const next = $('#hpList [data-delete]');
        (next || $('#hpTitleInput')).focus({ preventScroll: true });
      }
    });
    $('#sampleResetBtn').addEventListener('click', () => {
      this.routines = cloneSamples();
      this.activeCategory = '전체';
      $('#hpTitleInput').value = '';
      $('#hpAlertBox').hidden = true;
      $('#hpTitleInput').removeAttribute('aria-invalid');
      this.commitProduct('예시 루틴 4개로 되돌렸습니다. 달성률 75퍼센트.');
    });
  }
  focusToggle(id) {
    [...$$('[data-toggle]')].find((input) => input.dataset.toggle === id)?.focus({ preventScroll: true });
  }
  addRoutine() {
    const input = $('#hpTitleInput');
    const title = input.value.trim();
    if (!title) {
      $('#hpAlertBox').hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus({ preventScroll: true });
      return;
    }
    const category = $('#hpCatSelect').value;
    const id =
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `routine-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.routines.unshift({ id, title: title.slice(0, 120), category, completed: false });
    if (this.activeCategory !== '전체' && this.activeCategory !== category) this.activeCategory = category;
    input.value = '';
    $('#hpAlertBox').hidden = true;
    input.removeAttribute('aria-invalid');
    this.commitProduct(`${title} 추가됨.`);
    input.focus({ preventScroll: true });
  }
  commitProduct(message) {
    this.persistItems();
    this.renderProduct();
    $('#appAnnouncement').textContent = message;
  }
  renderProduct() {
    const total = this.routines.length,
      done = this.routines.filter((item) => item.completed).length,
      rate = getRate(this.routines);
    $('#hpRate').innerHTML = `${rate}<span>%</span>`;
    $('#hpStat').textContent = `${total}개 중 ${done}개 완료`;
    $('#hpGauge').setAttribute('aria-valuenow', String(rate));
    $('#hpGaugeFill').style.width = `${rate}%`;
    $('.product-ring .ring-value').style.strokeDashoffset = String(100 - rate);
    $('#hpRingText').textContent = `${done} / ${total}`;
    $('#hpRemaining').textContent = `남은 루틴 ${total - done}개`;
    $('#sideTotal').textContent = total;
    $$('[data-side-count]').forEach((el) => {
      el.textContent = this.routines.filter((item) => item.category === el.dataset.sideCount).length;
    });
    $('#hpTabs').innerHTML = PROJECT_SPEC.categories
      .map(
        (cat) =>
          `<button class="product-tab ${this.activeCategory === cat ? 'active' : ''}" data-filter="${cat}" aria-pressed="${this.activeCategory === cat}">${cat}<span>${cat === '전체' ? total : this.routines.filter((item) => item.category === cat).length}</span></button>`,
      )
      .join('');
    $$('.product-side-categories [data-filter]').forEach((btn) =>
      btn.setAttribute('aria-pressed', String(this.activeCategory === btn.dataset.filter)),
    );
    const visible =
      this.activeCategory === '전체'
        ? this.routines
        : this.routines.filter((item) => item.category === this.activeCategory);
    $('#hpList').innerHTML = visible.length
      ? visible
          .map(
            (item) =>
              `<li class="product-item ${item.completed ? 'is-done' : ''}"><label><input type="checkbox" data-toggle="${escapeHTML(item.id)}" ${item.completed ? 'checked' : ''}><span class="product-item-title">${escapeHTML(item.title)}</span></label><span class="product-category">${item.category}</span><button class="delete-button" data-delete="${escapeHTML(item.id)}" aria-label="${escapeHTML(item.title)} 삭제" title="루틴 삭제">${icon('trash')}</button></li>`,
          )
          .join('')
      : `<li class="empty-state">${icon('list-checks')}<strong>${total === 0 ? '아직 등록한 루틴이 없어요.' : `${escapeHTML(this.activeCategory)} 루틴이 없어요.`}</strong><span>${total === 0 ? '오늘 할 일 하나로 시작해 보세요. 달성률은 0%에서 출발합니다.' : '새 루틴을 추가하거나 다른 카테고리를 선택해 보세요.'}</span></li>`;
    $('#productSaveNote').innerHTML =
      `${icon(this.storageAvailable ? 'check' : 'circle-alert')} ${this.storageAvailable ? '이 브라우저에 자동 저장됩니다' : '브라우저 저장 불가 · 현재 탭에서만 유지됩니다'}`;
  }
  setStatus(text) {
    this.statusText = text;
    this.updatePlayback();
  }
  updatePlayback() {
    document.body.classList.toggle('is-running', this.isRunning);
    document.body.classList.toggle('is-paused', this.isPaused);
    document.body.style.setProperty('--playback-speed', this.speed);
    $$('.work-live > span:last-child').forEach((el) => {
      el.textContent = this.isPaused ? '일시정지' : this.isRunning ? '지금 진행 중' : '직접 살펴보기';
    });
    $('#pauseBtn').disabled = !this.isRunning;
    $('#pauseBtn').innerHTML = icon(this.isPaused ? 'play' : 'pause');
    $('#pauseBtn').setAttribute('aria-label', this.isPaused ? '계속 재생' : '일시정지');
    $('#pauseBtn').title = this.isPaused ? '계속 재생' : '일시정지';
    $('#playbackDot').classList.toggle('is-playing', this.isRunning && !this.isPaused);
    $('#playbackText').textContent = this.isPaused
      ? '일시정지됨 · 계속 재생을 누르면 이어집니다.'
      : this.statusText || '한 줄의 요청으로 시작하는 AI 팀 프로젝트';
    $$('.nav-item').forEach((btn) =>
      btn.classList.toggle('is-complete', this.completed.has(Number(btn.dataset.stage))),
    );
  }
  stop() {
    this.runToken++;
    this.isRunning = false;
    this.isPaused = false;
    this.updatePlayback();
  }
  showStage(n, focus = false) {
    this.currentStage = n;
    for (let i = 0; i <= TOTAL_STAGES; i++) $(`#stage${i}`).hidden = i !== n;
    $$('.nav-item').forEach((btn) => {
      const active = Number(btn.dataset.stage) === n;
      btn.classList.toggle('active', active);
      if (active) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    $('#stageNavigation').hidden = n === 0;
    $('#stageCounter').textContent =
      `${String(n).padStart(2, '0')} / ${String(TOTAL_STAGES).padStart(2, '0')}`;
    $('#replayStageBtn').hidden = n === STAGE.product;
    $('#nextStageBtn').innerHTML =
      n === STAGE.product ? `오버뷰로 돌아가기 ${icon('arrow-right')}` : `다음 단계 ${icon('arrow-right')}`;
    if (focus) {
      if (!this.isPresentationLayout()) window.scrollTo({ top: 0, behavior: 'instant' });
      const heading = $(`#stageTitle${n}`) || $('#homeTitle');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  async goToStage(n, replay = false) {
    this.stop();
    this.showStage(n, true);
    if (n === 0) {
      this.setStatus('한 줄의 요청으로 시작하는 AI 팀 프로젝트');
      return;
    }
    if (n === STAGE.product) {
      this.renderProduct();
      this.setStatus('완성된 하루루틴 · 직접 체크하고, 추가하고, 삭제해 보세요.');
      return;
    }
    if (this.completed.has(n) && !replay) {
      this.setStatus('완료한 단계입니다. 다시 보기로 과정을 재생할 수 있습니다.');
      return;
    }
    this.completed.delete(n);
    const token = this.runToken;
    this.isRunning = true;
    this.updatePlayback();
    const done = await this.playStage(n, token);
    if (done && token === this.runToken) {
      this.isRunning = false;
      this.setStatus('이 단계가 완료되었습니다. 다음 단계로 이동하거나 다시 살펴보세요.');
    }
  }
  async startFullSimulation() {
    this.stop();
    this.completed.clear();
    const token = this.runToken;
    this.isRunning = true;
    this.updatePlayback();
    for (let n = 1; n < STAGE.product; n++) {
      if (token !== this.runToken) return;
      this.showStage(n, true);
      if (!(await this.playStage(n, token))) return;
    }
    if (token !== this.runToken) return;
    this.isRunning = false;
    this.completed.add(STAGE.product);
    this.showStage(STAGE.product, true);
    this.renderProduct();
    this.setStatus('AI 팀의 제작 과정이 완료되었습니다. 이제 하루루틴을 직접 사용해 보세요.');
  }
  async wait(ms, token, tick) {
    let elapsed = 0,
      previous = performance.now();
    if (token !== this.runToken) return false;
    tick?.(0);
    while (elapsed < ms) {
      await new Promise((resolve) => setTimeout(resolve, 16));
      if (token !== this.runToken) return false;
      const now = performance.now();
      if (!this.isPaused) {
        elapsed += Math.min(now - previous, 100) * this.speed;
        tick?.(Math.min(1, elapsed / ms));
      }
      previous = now;
    }
    return token === this.runToken;
  }
  async playStage(n, token) {
    const success = await [
      null,
      this.playPlanning,
      this.playFunctions,
      this.playArchitecture,
      this.playDesign,
      this.playBuild,
      this.playReview,
    ][n].call(this, token);
    if (success && token === this.runToken) {
      this.completed.add(n);
      this.updatePlayback();
    }
    return success;
  }
  setFocus(n, models, action, target, step) {
    const list = Array.isArray(models) ? models : [models];
    $(`#focusModel${n}`).innerHTML = list
      .map((name) => agentChip(name, list.length > 1 ? '동시 작업' : '현재 담당'))
      .join('');
    $(`#focusAction${n}`).textContent = action;
    $(`#focusTarget${n}`).textContent = target;
    $$(`[data-story-steps="${n}"] [data-story-step]`).forEach((el) => {
      const index = Number(el.dataset.storyStep);
      el.classList.toggle('active', index === step);
      el.classList.toggle('complete', index < step);
    });
    this.setStatus(`${list.join(' + ')} · ${action}`);
  }
  setFocusProgress(n, percent) {
    const value = Math.max(0, Math.min(100, percent));
    $(`#focusFill${n}`).style.width = `${value}%`;
    const rounded = Math.round(value);
    const el = $(`#focusPercent${n}`);
    if (el.dataset.value !== String(rounded)) {
      el.dataset.value = String(rounded);
      el.innerHTML = `${rounded}<span>%</span>`;
    }
  }
  followFocus(selector) {
    if (this.isPresentationLayout()) return;
    const target = $(selector);
    if (!target || !this.isRunning) return;
    const rect = target.getBoundingClientRect();
    if (rect.height && (rect.top < 110 || rect.bottom > window.innerHeight - 30)) {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView?.({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
    }
  }
  async phase(ms, token, n, start, end, tick) {
    return this.wait(ms, token, (progress) => {
      this.setFocusProgress(n, start + (end - start) * progress);
      tick?.(progress);
    });
  }
  typeDocument(documentId, progress) {
    const doc = $(documentId);
    const rows = [...doc.querySelectorAll('[data-type-text]')];
    const total = rows.reduce((sum, row) => sum + row.dataset.typeText.length, 0);
    let remaining = Math.floor(total * progress);
    rows.forEach((row) => {
      const length = row.dataset.typeText.length;
      const count = Math.max(0, Math.min(length, remaining));
      row.querySelector('.typed-copy').textContent = row.dataset.typeText.slice(0, count);
      row.querySelector('.untyped-copy').textContent = row.dataset.typeText.slice(count);
      row.classList.toggle('revealed', count > 0);
      row.classList.toggle('typing', count > 0 && count < length);
      remaining -= length;
    });
  }
  setDocumentState(id, state) {
    const doc = $(id);
    doc.dataset.state = state;
    doc.querySelector('.document-state').textContent = {
      waiting: '작성 대기',
      writing: '작성 중',
      complete: '문서 완성',
    }[state];
  }
  resetPreparation(documentId, resultId, n) {
    const doc = $(documentId),
      result = $(resultId);
    this.setDocumentState(documentId, 'writing');
    doc
      .querySelectorAll('.is-writing, .is-complete')
      .forEach((el) => el.classList.remove('is-writing', 'is-complete'));
    doc.querySelectorAll('[data-type-text]').forEach((el) => this.typeField(el, 0));
    result.classList.remove('success');
    result.querySelector('span').textContent = '작성 중';
    this.setFocusProgress(n, 0);
  }
  typeField(el, progress) {
    const text = el.dataset.typeText,
      count = Math.floor(text.length * progress);
    el.querySelector('.typed-copy').textContent = text.slice(0, count);
    el.querySelector('.untyped-copy').textContent = text.slice(count);
    el.classList.toggle('typing', count > 0 && count < text.length);
    el.classList.toggle('revealed', count > 0);
  }
  completePreparation(documentId, resultId, label, message) {
    this.setDocumentState(documentId, 'complete');
    const result = $(resultId);
    result.classList.add('success');
    result.querySelector('span').textContent = label;
    result.querySelector('strong').textContent = message;
  }
  async playPlanning(token) {
    const n = STAGE.planning;
    this.resetPreparation('#planDocument', '#planResult', n);
    $('#planningInputRail').dataset.state = 'working';
    this.setFocus(
      n,
      'Claude Opus 5.5',
      '요청을 읽고, 기획의 방향을 잡습니다.',
      '오른쪽 기획안에 목표, 대상자, 만들 것이 채워집니다.',
      1,
    );
    if (!(await this.phase(650, token, n, 0, 9))) return false;
    const parts = $$('#planDocument [data-document-part]');
    for (let i = 0; i < parts.length; i++) {
      const field = PROJECT_SPEC.brief[i],
        part = parts[i];
      part.classList.add('is-writing');
      this.setFocus(
        n,
        'Claude Opus 5.5',
        `${field.label}${i === 2 ? '을' : '를'} 기획안에 정리합니다.`,
        [
          '어떤 문제를 해결하려는지 먼저 정합니다.',
          '이 프로그램을 사용할 사람을 정합니다.',
          '최종 결과물의 형태와 범위를 확정합니다.',
        ][i],
        i === 2 ? 3 : 2,
      );
      if (!(await this.phase(1400, token, n, 9 + i * 27, 9 + (i + 1) * 27, (p) => this.typeField(part, p))))
        return false;
      part.classList.remove('is-writing');
      part.classList.add('is-complete');
    }
    $('#planningInputRail').dataset.state = 'complete';
    this.completePreparation(
      '#planDocument',
      '#planResult',
      '기획안 완성',
      '목표·대상자·만들 것을 확정했습니다. 다음은 기능을 정의하는 과정입니다.',
    );
    this.setFocus(
      n,
      'Claude Opus 5.5',
      '기획안을 기능정의 과정에 전달합니다.',
      '기획안에서는 목적과 범위를 정했습니다. 다음 화면에서 구체적인 기능을 나눕니다.',
      3,
    );
    return this.phase(750, token, n, 90, 100);
  }
  async playFunctions(token) {
    const n = STAGE.functions;
    this.resetPreparation('#functionDocument', '#functionResult', n);
    this.setFocus(
      n,
      'Claude Opus 5.5',
      '기획안을 받아, 필요한 행동을 나눕니다.',
      '기능마다 사용자 행동과 프로그램의 반응을 짝지어 보세요.',
      1,
    );
    if (!(await this.phase(550, token, n, 0, 10))) return false;
    const rows = $$('#functionDocument [data-feature]');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i],
        feature = PROJECT_SPEC.features[i];
      row.classList.add('is-writing');
      this.setFocus(
        n,
        'Claude Opus 5.5',
        `F0${i + 1} · ${feature.name}의 동작을 정의합니다.`,
        `${feature.trigger} → ${feature.response}`,
        2,
      );
      if (
        !(await this.phase(1100, token, n, 10 + i * 16, 10 + (i + 1) * 16, (p) =>
          this.typeField(row.querySelector('[data-type-text]'), p),
        ))
      )
        return false;
      row.classList.remove('is-writing');
      row.classList.add('is-complete');
    }
    this.completePreparation(
      '#functionDocument',
      '#functionResult',
      '기능 5개 정의 완료',
      '사용자 행동과 프로그램의 반응을 정했습니다. 기능정의서를 설계 과정에 전달합니다.',
    );
    this.setFocus(
      n,
      'Claude Opus 5.5',
      '기능 5개와 반드시 지킬 조건을 확정합니다.',
      '빈 제목 차단과 0개일 때 0%도 기능의 동작 기준에 포함합니다.',
      3,
    );
    return this.phase(750, token, n, 90, 100);
  }
  async playArchitecture(token) {
    const n = STAGE.architecture;
    this.resetPreparation('#designDocument', '#architectureResult', n);
    const check = $('#planningCheck');
    check.dataset.state = 'waiting';
    $('#formulaComparison').classList.remove('has-error', 'is-patched');
    $('#planningCheckState').textContent = '검증 대기';
    $('#formulaNote').className = 'validation-note';
    $('#formulaNote').innerHTML =
      `${icon('scan-line')}<span>설계안을 작성한 뒤 계산 규칙을 검증합니다.</span>`;
    this.setFocus(
      n,
      'Claude Opus 5.5',
      '기능정의서를 읽고, 구현할 구조를 정합니다.',
      '기술 스택 → 데이터 저장 구조 → 아키텍처 순서로 설계합니다.',
      1,
    );
    if (!(await this.phase(500, token, n, 0, 7))) return false;
    const parts = $$('#designDocument [data-design-part]');
    const actions = [
      '화면과 기능에 사용할 기술 스택을 선택합니다.',
      '루틴의 저장소와 데이터 항목을 설계합니다.',
      '화면·기능·저장 계층을 연결합니다.',
    ];
    const targets = [
      'HTML은 구조, CSS는 스타일, JavaScript는 동작을 담당합니다.',
      '이 시연은 LocalStorage에 id·title·category·completed를 저장합니다.',
      '입력한 값이 기능과 저장 계층을 거쳐 다시 화면에 반영됩니다.',
    ];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      part.classList.add('is-writing');
      this.setFocus(n, 'Claude Opus 5.5', actions[i], targets[i], i === 2 ? 3 : 2);
      if (!(await this.phase(1000, token, n, 7 + i * 16, 7 + (i + 1) * 16))) return false;
      part.classList.remove('is-writing');
      part.classList.add('is-complete');
    }
    this.setDocumentState('#designDocument', 'complete');
    check.dataset.state = 'active';
    $('#formulaComparison').classList.add('has-error');
    $('#planningCheckState').textContent = '빈 목록 시험 중';
    $('#formulaNote').className = 'validation-note error';
    $('#formulaNote').innerHTML =
      `${icon('circle-alert')}<span>할 일이 0개면 0 ÷ 0이 됩니다. 숫자가 아닌 값(NaN)이 나옵니다.</span>`;
    this.setFocus(
      n,
      'GPT-6.1-Sol',
      '다른 모델이 설계의 빈틈을 확인합니다.',
      '아래 계산이 NaN%에서 안전한 0%로 바뀝니다.',
      4,
    );
    if (!(await this.phase(1500, token, n, 55, 78))) return false;
    check.dataset.state = 'complete';
    $('#planningCheckState').textContent = '안전 조건 반영';
    $('#formulaComparison').classList.add('is-patched');
    $('#formulaNote').className = 'validation-note success';
    $('#formulaNote').innerHTML =
      `${icon('shield-check')}<span>설계안 수정: 전체 할 일이 0개이면 0%를 표시합니다.</span>`;
    if (!(await this.phase(1000, token, n, 78, 93))) return false;
    this.completePreparation(
      '#designDocument',
      '#architectureResult',
      '설계·교차 검증 완료',
      '기술 스택·저장 구조·아키텍처와 검증된 계산 규칙을 디자인·개발 팀에 전달합니다.',
    );
    return this.phase(750, token, n, 93, 100);
  }

  setDesignLayer(n, announce = true) {
    const layer = PROJECT_SPEC.designLayers[n - 1];
    $('#designCanvas').dataset.layer = String(n);
    $$('.layer-button').forEach((btn) => {
      const index = Number(btn.dataset.layer);
      btn.classList.toggle('active', index === n);
      btn.classList.toggle('done', index < n);
      btn.setAttribute('aria-pressed', String(index === n));
      btn.style.setProperty('--layer-progress', index < n ? '100%' : '0%');
    });
    $('#layerCount').textContent = `${n} / 4`;
    $('#layerModel').innerHTML = `${modelLogo(layer.model)} ${layer.model}`;
    $('#layerTag').textContent = `${n}층 · ${layer.title}`;
    $('#layerChange').textContent = layer.change;
    $('#layerReviewCount').textContent = n === 4 ? '빈칸 경고 + 삭제 조작 추가' : '';
    $('.canvas-change').classList.toggle('review-applied', n === 4);
    const labels = [
      '점선 상자 네 개의 위치를 잡습니다',
      '글자와 75% 숫자를 채웁니다',
      '파란 게이지와 화면 스타일을 적용합니다',
      '여기에 경고 안내줄과 삭제 버튼이 추가됩니다',
    ];
    $('#canvasAnnotationText').textContent = labels[n - 1];
    $('#canvasCursorLabel').textContent = n === 4 ? 'Claude · 리뷰 반영' : 'Gemini · 디자인 중';
    if (announce) {
      this.setFocus(STAGE.design, layer.model, `${n}층 · ${layer.title}`, labels[n - 1], n);
      this.setFocusProgress(STAGE.design, (n / 4) * 100);
    }
  }
  async playDesign(token) {
    for (let n = 1; n <= 4; n++) {
      this.setDesignLayer(n);
      if (
        !(await this.phase(n === 4 ? 3600 : 2600, token, STAGE.design, (n - 1) * 25, n * 25, (p) => {
          $('.layer-button.active').style.setProperty('--layer-progress', `${p * 100}%`);
        }))
      )
        return false;
    }
    return true;
  }
  updateLane(kind, value) {
    const percent = Math.round(value * 100);
    const frontend = kind === 'frontend';
    $('#assemblyPreview').dataset[frontend ? 'screenParts' : 'functionParts'] = String(Math.floor(value * 3));
    $(`#${kind}LaneFill`).style.width = `${value * 100}%`;
    $(`#${kind}Percent`).textContent = `${percent}%`;
    $(`#${kind}Lane`).classList.toggle('is-working', value < 1);
    let current = Math.min(2, Math.floor(value * 3));
    $(`#${kind}Current`).textContent =
      value >= 1
        ? '부품 3개 완성 · 앱으로 전달'
        : `${frontend ? PROJECT_SPEC.buildParts[current].ui : PROJECT_SPEC.buildParts[current].fn} 만드는 중`;
    for (let i = 0; i < 3; i++) {
      const p = Math.max(0, Math.min(1, value * 3 - i));
      const unit = $(`#${frontend ? 'fe' : 'be'}Unit${i}`);
      unit.classList.toggle('is-building', p > 0 && p < 1);
      unit.classList.toggle('is-complete', p >= 1);
      unit.querySelector('.unit-meter i').style.width = `${p * 100}%`;
      unit.querySelector('.unit-state').textContent =
        p >= 1 ? '완성' : p > 0 ? `${Math.round(p * 100)}%` : '다음 작업';
    }
    const lines = PROJECT_SPEC.buildParts
      .slice(0, Math.floor(value * 3))
      .map((part) => (frontend ? part.codeFE : part.codeBE));
    $(`#${frontend ? 'frontendCode' : 'backendCode'}`).textContent = lines.join('\n');
  }
  setAssemblyRate(rate) {
    const app = $('#assemblyPreview .mini-app');
    app.querySelector('.mini-rate').innerHTML = `${rate}<span>%</span>`;
    app.querySelector('.mini-bar > span').style.width = `${rate}%`;
    app.querySelector('.ring-value').style.strokeDashoffset = String(100 - rate);
    const check = app.querySelector('.mini-row:last-child');
    check.classList.toggle('is-done', rate === 100);
    check.querySelector('.mini-checkbox').innerHTML = rate === 100 ? icon('check') : '';
    app.querySelector('.mini-summary small').innerHTML =
      rate === 100 ? '4개의 루틴 중 <b>4개 완료</b>' : '4개의 루틴 중 <b>3개 완료</b>';
  }
  async playBuild(token) {
    $('#assemblyProof').classList.remove('is-proven');
    $('#parallelWorkspace').classList.remove('is-merged');
    $('#assemblyPreview').className = 'assembly-preview';
    $('#assemblyStatus').textContent = '화면과 기능을 동시에 만드는 중';
    this.setAssemblyRate(75);
    this.updateLane('frontend', 0);
    this.updateLane('backend', 0);
    $('#buildResult').classList.remove('success');
    $('#buildResult span').textContent = '두 팀 동시 작업';
    $('#buildResult strong').textContent = '두 진행 막대가 같은 순간에 출발합니다. 서로를 기다리지 않습니다.';
    this.setFocus(
      STAGE.build,
      ['Claude Sonnet 5.5', 'GPT-6.1-Sol'],
      '화면 팀과 기능 팀, 동시에 시작합니다.',
      '왼쪽 두 카드의 진행 막대가 함께 움직이는 것을 보세요.',
      1,
    );
    let phase = 1;
    if (
      !(await this.phase(8800, token, STAGE.build, 0, 78, (p) => {
        const fe = Math.min(1, p * 1.17),
          be = Math.min(1, p * 1.04);
        this.updateLane('frontend', fe);
        this.updateLane('backend', be);
        $('#parallelElapsed').textContent = `00:${String(Math.floor(p * 8.8)).padStart(2, '0')}`;
        if (p > 0.08 && phase === 1) {
          phase = 2;
          this.setFocus(
            STAGE.build,
            ['Claude Sonnet 5.5', 'GPT-6.1-Sol'],
            '각자 부품을 만드는 동안, 다른 팀도 계속 작업합니다.',
            '화면 부품은 왼쪽, 작동법은 가운데에서 동시에 만들어집니다.',
            2,
          );
        }
        $('#assemblyPreview').classList.toggle('has-screen', fe >= 0.34);
        $('#assemblyPreview').classList.toggle('has-functions', be >= 0.67);
        if (fe >= 0.34)
          $('#assemblyStatus').textContent =
            be >= 1 ? '화면과 기능이 모두 도착했습니다.' : '화면 부품 도착 · 기능을 연결하는 중';
      }))
    )
      return false;
    this.updateLane('frontend', 1);
    this.updateLane('backend', 1);
    $('#parallelWorkspace').classList.add('is-merged');
    $('#assemblyPreview').classList.add('has-screen', 'has-functions', 'is-merged');
    this.followFocus('#assemblyPreview');
    $('#assemblyStatus').textContent = '화면 + 기능 연결 완료';
    this.setFocus(
      STAGE.build,
      ['Claude Sonnet 5.5', 'GPT-6.1-Sol'],
      '두 팀의 결과를 하나의 앱으로 연결합니다.',
      '오른쪽 앱에 화면과 기능이 함께 들어왔습니다.',
      3,
    );
    if (!(await this.phase(1400, token, STAGE.build, 78, 88))) return false;
    $('#assemblyPreview').classList.add('is-demo');
    this.setFocus(
      STAGE.build,
      'GPT-6.1-Sol',
      '체크 한 번으로, 연결된 기능을 확인합니다.',
      '오른쪽 앱의 마지막 루틴과 75% → 100% 변화를 보세요.',
      4,
    );
    if (!(await this.phase(1000, token, STAGE.build, 88, 94))) return false;
    this.setAssemblyRate(100);
    $('#assemblyStatus').textContent = '체크 한 번 → 달성률 75%에서 100%';
    $('#assemblyProof').classList.add('is-proven');
    $('#buildResult').classList.add('success');
    $('#buildResult span').textContent = '연결·동작 확인';
    $('#buildResult strong').textContent =
      '동시에 만든 화면과 기능을 합쳤습니다. 체크하면 달성률이 실제로 바뀝니다.';
    return this.phase(1500, token, STAGE.build, 94, 100);
  }
  setReviewCase(index) {
    const defect = PROJECT_SPEC.defects[index];
    $(`[data-review-case="${index}"]`).classList.remove('is-complete');
    $(`[data-retro="${index}"]`).classList.remove('is-recorded');
    $('#reviewResult').classList.remove('success');
    $('#reviewResult span').textContent = '선택한 상황 검증 중';
    $('#reviewResult strong').textContent = '오류를 재현한 뒤, 수정하고 같은 행동으로 다시 확인합니다.';
    $('#retroStamp').classList.remove('is-recorded');
    $('#retroStamp').textContent = '지금 검증하는 상황의 규칙을 다시 정리합니다.';
    $$('.review-case-button').forEach((btn) => {
      const active = Number(btn.dataset.reviewCase) === index;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    $$('[data-patch]').forEach((card) => {
      card.hidden = Number(card.dataset.patch) !== index;
    });
    $('#sandboxTestLabel').textContent =
      index === 0 ? 'CASE 01 · 저장된 내용 없이 처음 켜기' : 'CASE 02 · 공백 3칸으로 등록하기';
    $('#reviewCause').textContent =
      index === 0 ? '저장된 목록이 없는 첫 실행도 정상 작동할까요?' : '제목을 쓰지 않고 등록해도 괜찮을까요?';
    $('#sandboxAction').textContent =
      index === 0 ? '사용자처럼 앱을 처음 켜 봅니다.' : '사용자처럼 공백만 넣고 등록을 누릅니다.';
    $('#sandboxInputValue').textContent = index === 0 ? '새 할 일을 입력하세요' : '␣ ␣ ␣';
    $('#reviewRetest').classList.remove('is-passed');
    $('#reviewRetest').innerHTML = `${icon('rotate-ccw')} 같은 조작으로 한 번 더 확인합니다.`;
    $('.review-patch-panel').classList.remove('is-patching');
    $('#reviewEventTitle').textContent = '사용자가 할 행동을 따라 합니다.';
    $('#reviewPhaseLabel').textContent = '01 · 오류를 재현하는 중';
    $('#reviewEventModel').innerHTML = agentChip('Claude Sonnet 5.5', '직접 공격 테스트');
    const card = $(`[data-patch="${index}"]`);
    card.classList.remove('is-fixed');
    card.querySelector('.after code').textContent = defect.after;
    card.querySelector('.patch-state').textContent = '오류를 확인한 뒤 코드를 수정합니다.';
    this.renderReviewState(index, 'ready');
  }
  renderReviewState(index, state, retest = false) {
    const sandbox = $('#reviewSandbox');
    sandbox.dataset.case = String(index);
    sandbox.dataset.state = state;
    sandbox.dataset.retest = String(retest);
    const failed = state === 'error' || state === 'patching';
    const verified = state === 'verified';
    $('#sandboxRate').innerHTML =
      index === 0 ? `${verified ? '0' : '—'}<small>%</small>` : '75<small>%</small>';
    $('.sandbox-gauge i').style.width = index === 0 ? '0%' : '75%';
    $('#sandboxRows').innerHTML =
      index === 0
        ? '<span class="sandbox-empty">아직 등록한 루틴이 없습니다.</span>'
        : `<div class="sandbox-routine">${icon('check')}<span>20분 산책하기</span><small>건강</small></div>${failed ? `<div class="sandbox-blank-row">${icon('circle-alert')}<span>제목이 없는 루틴이 등록됐어요.</span><small>오류</small></div>` : ''}`;
    const messages =
      index === 0
        ? {
            ready: '처음 쓰는 사람의 상황으로 시험합니다.',
            running: retest
              ? '수정 후 같은 첫 실행을 다시 시도합니다.'
              : '저장된 내용이 없는 상태로 앱을 켜는 중',
            error: '오류 발견 · 빈 목록을 처리하지 못해 앱이 멈췄습니다.',
            patching: 'GPT가 안전한 빈 목록을 준비하도록 수정 중',
            verified: '정상 동작 · 빈 목록에서 0%로 시작합니다.',
          }
        : {
            ready: '아무 글자 없이 공백만 입력합니다.',
            running: retest ? '수정 후 공백으로 등록을 다시 시도합니다.' : '공백 3칸 입력 → 등록 버튼 클릭',
            error: '오류 발견 · 제목 없는 할 일이 등록됐습니다.',
            patching: 'GPT가 입력값을 저장 전에 검사하도록 수정 중',
            verified: '정상 동작 · 등록은 차단되고 경고가 표시됩니다.',
          };
    $('#sandboxResult').textContent = messages[state];
    $('#sandboxActionState').textContent = verified
      ? '정상 확인'
      : failed
        ? '오류 확인'
        : retest
          ? '다시 실행 중'
          : state === 'running'
            ? '실행 중'
            : '준비';
  }
  async playReviewCase(index, token) {
    const defect = PROJECT_SPEC.defects[index],
      start = index * 50;
    this.setReviewCase(index);
    this.renderReviewState(index, 'running');
    this.followFocus('#reviewSandbox');
    this.setFocus(
      STAGE.review,
      ['Claude Sonnet 5.5', 'Gemini 4 Argon'],
      index === 0 ? '앱을 처음 켜서, 문제가 생기는지 봅니다.' : '빈칸으로 등록해서, 문제가 생기는지 봅니다.',
      '왼쪽 테스트 앱에서 직접 일어나는 일을 보세요.',
      1,
    );
    if (!(await this.phase(1300, token, STAGE.review, start, start + 6))) return false;
    this.renderReviewState(index, 'error');
    $('#reviewCause').textContent =
      index === 0
        ? '저장된 값은 null인데, 준비 없이 목록을 읽었습니다.'
        : '공백을 검사하지 않아, 제목 없는 항목이 저장됐습니다.';
    $('#reviewEventTitle').textContent =
      index === 0 ? '첫 실행에서 앱이 멈췄습니다.' : '제목 없는 할 일이 생겼습니다.';
    $('#defectCount').textContent = `CASE 0${index + 1} · 오류를 재현했습니다.`;
    if (!(await this.phase(1700, token, STAGE.review, start + 6, start + 15))) return false;
    this.setFocus(
      STAGE.review,
      'GPT-6.1-Sol',
      '오류를 만든 코드를 직접 수정합니다.',
      '오른쪽 코드에서 바뀌는 한 줄을 보세요.',
      2,
    );
    $('#reviewEventModel').innerHTML = agentChip('GPT-6.1-Sol', '담당 개발 AI · 패치');
    $('#reviewPhaseLabel').textContent = '02 · 담당 개발 AI가 수정';
    $('#reviewEventTitle').textContent =
      index === 0 ? '빈 목록을 준비하는 한 줄 추가.' : '공백을 막는 한 줄 추가.';
    $('.review-patch-panel').classList.add('is-patching');
    this.renderReviewState(index, 'patching');
    this.followFocus('.review-patch-panel');
    const patch = $(`[data-patch="${index}"]`);
    patch.classList.add('is-fixed');
    if (
      !(await this.phase(1800, token, STAGE.review, start + 15, start + 28, (p) => {
        patch.querySelector('.after code').textContent = defect.after.slice(
          0,
          Math.floor(defect.after.length * p),
        );
      }))
    )
      return false;
    patch.querySelector('.after code').textContent = defect.after;
    patch.querySelector('.patch-state').textContent = '패치 적용 완료';
    $('.review-patch-panel').classList.remove('is-patching');
    this.setFocus(
      STAGE.review,
      ['Claude Sonnet 5.5', 'Gemini 4 Argon'],
      '같은 행동을 다시 실행합니다.',
      '이번에는 앱이 멈추지 않고, 잘못된 등록도 차단합니다.',
      3,
    );
    $('#reviewEventModel').innerHTML = agentChip('Gemini 4 Argon', '수정된 앱 재검증');
    $('#reviewPhaseLabel').textContent = '03 · 같은 조건으로 다시 실행';
    $('#reviewEventTitle').textContent = '고쳤다는 말 대신, 직접 확인.';
    this.renderReviewState(index, 'running', true);
    if (!(await this.phase(1300, token, STAGE.review, start + 28, start + 35))) return false;
    this.renderReviewState(index, 'verified');
    $('#reviewRetest').classList.add('is-passed');
    $('#reviewRetest').innerHTML = `${icon('check')} ${defect.result} · 같은 조건 재검증 통과`;
    if (!(await this.phase(1200, token, STAGE.review, start + 35, start + 41))) return false;
    this.setFocus(
      STAGE.review,
      ['Claude Sonnet 5.5', 'Gemini 4 Argon'],
      '고친 이유를, 다음 작업의 규칙으로 남깁니다.',
      '오른쪽 아래 회고록에 규칙이 들어가는 것을 보세요.',
      4,
    );
    $('#reviewPhaseLabel').textContent = '04 · 재발 방지 규칙 기록';
    $('#reviewEventTitle').textContent = '같은 실수를 반복하지 않도록.';
    $(`[data-retro="${index}"]`).classList.add('is-recorded');
    this.followFocus('.review-retro-panel');
    if (!(await this.phase(1300, token, STAGE.review, start + 41, start + 50))) return false;
    $(`[data-review-case="${index}"]`).classList.add('is-complete');
    this.recordRetrospective();
    return true;
  }
  recordRetrospective() {
    const rules = [...$$('[data-retro].is-recorded')]
      .map((el) => PROJECT_SPEC.defects[Number(el.dataset.retro)])
      .map((defect) => ({ rule: defect.rule, detail: defect.ruleDetail }));
    let stored = true;
    try {
      let previous = [];
      try {
        const saved = JSON.parse(localStorage.getItem(PROJECT_SPEC.retroKey) || '{}');
        if (Array.isArray(saved.rules))
          previous = saved.rules.filter((r) => typeof r.rule === 'string' && typeof r.detail === 'string');
      } catch (_) {}
      const merged = new Map([...previous, ...rules].map((rule) => [rule.rule, rule]));
      localStorage.setItem(
        PROJECT_SPEC.retroKey,
        JSON.stringify({ recordedAt: new Date().toISOString(), rules: [...merged.values()] }),
      );
    } catch (_) {
      stored = false;
    }
    $('#retroStamp').classList.add('is-recorded');
    $('#retroStamp').innerHTML =
      `${icon('check')} 이번 시연 ${rules.length}건 · ${stored ? '이 브라우저에 저장됨' : '이번 세션에 기록됨'}`;
  }
  async playReview(token) {
    $$('[data-patch]').forEach((el) => el.classList.remove('is-fixed'));
    $$('[data-retro]').forEach((el) => el.classList.remove('is-recorded'));
    $$('.review-case-button').forEach((el) => el.classList.remove('is-complete'));
    $('#retroStamp').className = 'retro-stamp';
    $('#retroStamp').textContent = '문제를 해결한 뒤 규칙을 기록합니다.';
    $('#reviewResult').classList.remove('success');
    $('#reviewResult span').textContent = '실제 앱으로 검증';
    for (let index = 0; index < 2; index++) if (!(await this.playReviewCase(index, token))) return false;
    this.finishReview();
    return this.phase(900, token, STAGE.review, 100, 100);
  }
  finishReview() {
    $('#defectCount').textContent = '오류 2건 수정 · 같은 조건 재검증 2건 통과';
    $('#reviewResult').classList.add('success');
    $('#reviewResult span').textContent = '리뷰·회고 완료';
    $('#reviewResult strong').textContent =
      '멈추던 앱은 정상 시작. 공백 등록은 차단. 재발 방지 규칙 2건 저장.';
  }

  resetSimulation() {
    this.stop();
    this.completed.clear();
    this.showStage(0, true);
    this.setStatus('시뮬레이션을 처음으로 돌렸습니다. 하루루틴에 저장한 내용은 유지됩니다.');
  }
}
window.addEventListener('DOMContentLoaded', () => {
  window.studioApp = new AgenticStudioController();
});
