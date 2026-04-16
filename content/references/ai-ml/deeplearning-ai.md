---
type: reference
tags: []
title: "DeepLearning.AI"
source: notion
created: 2026-03-31T13:18
modified: 2026-03-31T13:18
publish: true
---

# DeepLearning.AI

Building and Evaluating Advanced RAG

By LlamaIndex

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/building-evaluating-advanced-rag/lesson/1/introduction](<https://learn.deeplearning.ai/building-evaluating-advanced-rag/lesson/1/introduction>)

Advanced RAG Pipeline

Setup
    
    
    from llama_index import SimpleDirectoryReader
    
    documents = SimpleDirectoryReader(
        input_files=["./eBook-How-to-Build-a-Career-in-AI.pdf"]
    ).load_data()

[![](DeepLearning%20AI/untitled.png)](<DeepLearning%20AI/untitled.png>)
    
    
    from llama_index import Document
    
    document = Document(text="\n\n".join([doc.text for doc in documents]))
    from llama_index import VectorStoreIndex
    from llama_index import ServiceContext
    from llama_index.llms import OpenAI
    
    llm = OpenAI(model="gpt-3.5-turbo", temperature=0.1)
    service_context = ServiceContext.from_defaults(
        llm=llm, embed_model="local:BAAI/bge-small-en-v1.5"
    )
    index = VectorStoreIndex.from_documents([document],
                                            service_context=service_context)
    
    query_engine = index.as_query_engine()
    response = query_engine.query(
        "What are steps to take when finding projects to build your experience?"
    )
    print(str(response))
    
    ---
    
    """
    When finding projects to build your experience, there are several steps you can take. First, you can join existing projects by asking to join someone else's project if they have an idea. Additionally, you can continue reading, taking courses, and talking to domain experts to come up with new ideas. It is also helpful to focus on an application area that has not yet been explored with machine learning. If your company or school has a particular application in mind, you can explore the possibilities for machine learning in that area. Finally, you can develop a side hustle or personal project that may not initially be part of your job but can help you gain experience and strengthen your skills.
    """

[![](DeepLearning%20AI/Untitled%201.png)](<DeepLearning%20AI/Untitled%201.png>)
    
    
    from trulens_eval import Tru
    from utils import get_prebuilt_trulens_recorder
    
    eval_questions = []
    with open('eval_questions.txt', 'r') as file:
        for line in file:
            # Remove newline character and convert to integer
            item = line.strip()
            print(item)
            eval_questions.append(item)
    
    tru = Tru()
    tru.reset_database()
    tru_recorder = get_prebuilt_trulens_recorder(query_engine,
                                                 app_id="Direct Query Engine")
    with tru_recorder as recording:
        for question in eval_questions:
            response = query_engine.query(question)
    records, feedback = tru.get_records_and_feedback(app_ids=[])
    records.head()
    
    # launches on http://localhost:8501/
    tru.run_dashboard()

[![](DeepLearning%20AI/Untitled%202.png)](<DeepLearning%20AI/Untitled%202.png>)
    
    
    from llama_index.llms import OpenAI
    from utils import build_sentence_window_index
    from utils import get_sentence_window_query_engine
    
    llm = OpenAI(model="gpt-3.5-turbo", temperature=0.1)
    
    sentence_index = build_sentence_window_index(
        document,
        llm,
        embed_model="local:BAAI/bge-small-en-v1.5",
        save_dir="sentence_index"
    )
    
    sentence_window_engine = get_sentence_window_query_engine(sentence_index)
    window_response = sentence_window_engine.query(
        "how do I get started on a personal project in AI?"
    )
    print(str(window_response))
    
    ---
    
    """
    To get started on a personal project in AI, it is important to first identify and scope the project. Consider what areas of AI interest you and align with your career goals. Once you have identified a project, start by defining the problem you want to solve or the goal you want to achieve. Then, break down the project into smaller steps or milestones to make it more manageable. As you work on the project, focus on continuous learning and skill progression. Building a portfolio of projects that show your growth and impact over time can also be beneficial for your career development in AI.
    """
    
    
    tru.reset_database()
    
    tru_recorder_sentence_window = get_prebuilt_trulens_recorder(
        sentence_window_engine,
        app_id = "Sentence Window Query Engine"
    )
    for question in eval_questions:
        with tru_recorder_sentence_window as recording:
            response = sentence_window_engine.query(question)
            print(question)
            print(str(response))
    tru.get_leaderboard(app_ids=[])
    # launches on http://localhost:8501/
    tru.run_dashboard()

[![](DeepLearning%20AI/Untitled%203.png)](<DeepLearning%20AI/Untitled%203.png>)
    
    
    from utils import build_automerging_index, get_automerging_query_engine
    
    automerging_index = build_automerging_index(
        documents,
        llm,
        embed_model="local:BAAI/bge-small-en-v1.5",
        save_dir="merging_index"
    )
    
    automerging_query_engine = get_automerging_query_engine(
        automerging_index,
    )
    
    auto_merging_response = automerging_query_engine.query(
        "How do I build a portfolio of AI projects?"
    )
    print(str(auto_merging_response))
    
    ---
    
    """
    To build a portfolio of AI projects, it is important to start with simple projects and gradually progress to more complex undertakings. This progression over time will demonstrate your growth and development in the field. Additionally, effective communication is crucial in order to explain your thinking and showcase the value of your work. Being able to articulate your ideas will help others see the potential in your projects and trust you with the necessary resources.
    """
    
    
    tru.reset_database()
    
    tru_recorder_automerging = get_prebuilt_trulens_recorder(automerging_query_engine,
                                                             app_id="Automerging Query Engine")
    for question in eval_questions:
        with tru_recorder_automerging as recording:
            response = automerging_query_engine.query(question)
            print(question)
            print(response)
    
    tru.get_leaderboard(app_ids=[])
    # launches on http://localhost:8501/
    tru.run_dashboard()

RAG Triad of Metrics

[![](DeepLearning%20AI/Untitled%204.png)](<DeepLearning%20AI/Untitled%204.png>)

[![](DeepLearning%20AI/Untitled%205.png)](<DeepLearning%20AI/Untitled%205.png>)

[![](DeepLearning%20AI/Untitled%206.png)](<DeepLearning%20AI/Untitled%206.png>)

[![](DeepLearning%20AI/Untitled%207.png)](<DeepLearning%20AI/Untitled%207.png>)

[![](DeepLearning%20AI/Untitled%208.png)](<DeepLearning%20AI/Untitled%208.png>)

[![](DeepLearning%20AI/Untitled%209.png)](<DeepLearning%20AI/Untitled%209.png>)

[![](DeepLearning%20AI/Untitled%2010.png)](<DeepLearning%20AI/Untitled%2010.png>)

[![](DeepLearning%20AI/Untitled%2011.png)](<DeepLearning%20AI/Untitled%2011.png>)

[![](DeepLearning%20AI/Untitled%2012.png)](<DeepLearning%20AI/Untitled%2012.png>)

[![](DeepLearning%20AI/Untitled%2013.png)](<DeepLearning%20AI/Untitled%2013.png>)

[![](DeepLearning%20AI/Untitled%2014.png)](<DeepLearning%20AI/Untitled%2014.png>)
    
    
    import utils
    
    import os
    import openai
    from trulens_eval import Tru
    from llama_index import SimpleDirectoryReader, Document
    from utils import build_sentence_window_index
    from llama_index.llms import OpenAI
    
    openai.api_key = utils.get_openai_api_key()
    
    tru = Tru()
    tru.reset_database()
    
    documents = SimpleDirectoryReader(
        input_files=["./eBook-How-to-Build-a-Career-in-AI.pdf"]
    ).load_data()
    
    
    document = Document(text="\n\n".\
                        join([doc.text for doc in documents]))
    
    
    llm = OpenAI(model="gpt-3.5-turbo", temperature=0.1)
    
    sentence_index = build_sentence_window_index(
        document,
        llm,
        embed_model="local:BAAI/bge-small-en-v1.5",
        save_dir="sentence_index"
    )
    
    
    from utils import get_sentence_window_query_engine
    
    sentence_window_engine = \
    get_sentence_window_query_engine(sentence_index)
    output = sentence_window_engine.query(
        "How do you create your AI portfolio?")
    output.response
    
    ---
    
    """
    'To create your AI portfolio, you should focus on building a collection of projects that demonstrate your skill progression. This can be achieved by starting with simpler projects and gradually working your way up to more complex ones. By showcasing a variety of projects, you can highlight your expertise in different areas of AI. Additionally, it is important to ensure that your portfolio reflects your career goals and aligns with the type of AI job you are seeking.'
    """

## Feedback Functions
    
    
    import nest_asyncio
    from trulens_eval import OpenAI as fOpenAI
    from trulens_eval import Feedback, TruLlama
    from trulens_eval.feedback import Groundedness
    import numpy as np
    
    nest_asyncio.apply()
    provider = fOpenAI()
    
    ## Answer Relevance
    
    f_qa_relevance = Feedback(
        provider.relevance_with_cot_reasons,
        name="Answer Relevance"
    ).on_input_output()
    
    ## Context Relevance
    context_selection = TruLlama.select_source_nodes().node.text
    
    f_qs_relevance = (
        Feedback(provider.qs_relevance,
                 name="Context Relevance")
        .on_input()
        .on(context_selection)
        .aggregate(np.mean)
    )
    
    # or with chain of thought
    f_qs_relevance = (
        Feedback(provider.qs_relevance_with_cot_reasons,
                 name="Context Relevance")
        .on_input()
        .on(context_selection)
        .aggregate(np.mean)
    )
    
    ## Groundedness
    grounded = Groundedness(groundedness_provider=provider)
    f_groundedness = (
        Feedback(grounded.groundedness_measure_with_cot_reasons,
                 name="Groundedness"
                )
        .on(context_selection)
        .on_output()
        .aggregate(grounded.grounded_statements_aggregator)
    )

## Evaluation of the RAG application
    
    
    from trulens_eval import TruLlama
    from trulens_eval import FeedbackMode
    
    tru_recorder = TruLlama(
        sentence_window_engine,
        app_id="App_1",
        feedbacks=[
            f_qa_relevance,
            f_qs_relevance,
            f_groundedness
        ]
    )
    
    eval_questions = []
    with open('eval_questions.txt', 'r') as file:
        for line in file:
            # Remove newline character and convert to integer
            item = line.strip()
            eval_questions.append(item)
    for question in eval_questions:
        with tru_recorder as recording:
            sentence_window_engine.query(question)
    records, feedback = tru.get_records_and_feedback(app_ids=[])
    records.head()
    tru.get_leaderboard(app_ids=[])
    tru.run_dashboard()

Sentence-Window retrieval

[![](DeepLearning%20AI/Untitled%2015.png)](<DeepLearning%20AI/Untitled%2015.png>)

## Window-sentence retrieval setup
    
    
    from llama_index.node_parser import SentenceWindowNodeParser
    
    # create the sentence window node parser w/ default settings
    node_parser = SentenceWindowNodeParser.from_defaults(
        window_size=3,
        window_metadata_key="window",
        original_text_metadata_key="original_text",
    )
    text = "hello. how are you? I am fine!  "
    
    nodes = node_parser.get_nodes_from_documents([Document(text=text)])
    print([x.text for x in nodes])
    
    """
    ['hello. ', 'how are you? ', 'I am fine!  ']
    """
    
    # window size of 3
    print(nodes[1].metadata["window"])
    
    """
    hello.  how are you?  I am fine!
    """

## Building the index
    
    
    from llama_index.llms import OpenAI
    from llama_index import ServiceContext, VectorStoreIndex
    
    llm = OpenAI(model="gpt-3.5-turbo", temperature=0.1)
    
    sentence_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model="local:BAAI/bge-small-en-v1.5",
        # embed_model="local:BAAI/bge-large-en-v1.5"
        node_parser=node_parser,
    )
    
    sentence_index = VectorStoreIndex.from_documents(
        [document], service_context=sentence_context
    )
    sentence_index.storage_context.persist(persist_dir="./sentence_index")

## Building the postprocessor
    
    
    from llama_index.indices.postprocessor import MetadataReplacementPostProcessor
    
    postproc = MetadataReplacementPostProcessor(
        target_metadata_key="window"
    )
    from llama_index.schema import NodeWithScore
    from copy import deepcopy
    
    scored_nodes = [NodeWithScore(node=x, score=1.0) for x in nodes]
    nodes_old = [deepcopy(n) for n in nodes]
    
    nodes_old[1].text
    
    """
    'foo bar. '
    """
    
    replaced_nodes = postproc.postprocess_nodes(scored_nodes)
    print(replaced_nodes[1].text)
    
    """
    hello.  foo bar.  cat dog.  mouse
    """

## Adding a reranker
    
    
    from llama_index.indices.postprocessor import SentenceTransformerRerank
    from llama_index import QueryBundle
    from llama_index.schema import TextNode, NodeWithScore
    
    # BAAI/bge-reranker-base
    # link: https://huggingface.co/BAAI/bge-reranker-base
    rerank = SentenceTransformerRerank(
        top_n=2, model="BAAI/bge-reranker-base"
    )
    
    query = QueryBundle("I want a dog.")
    
    # despite scoring "this is a dog" at 0.4
    scored_nodes = [
        NodeWithScore(node=TextNode(text="This is a cat"), score=0.6),
        NodeWithScore(node=TextNode(text="This is a dog"), score=0.4),
    ]
    
    reranked_nodes = rerank.postprocess_nodes(
        scored_nodes, query_bundle=query
    )
    
    # reranks at different scores
    print([(x.text, x.score) for x in reranked_nodes])
    
    """
    [('This is a dog', 0.91827345), ('This is a cat', 0.0014040739)]
    """

## Running the query engine
    
    
    from llama_index.response.notebook_utils import display_response
    
    sentence_window_engine = sentence_index.as_query_engine(
        similarity_top_k=6, node_postprocessors=[postproc, rerank]
    )
    window_response = sentence_window_engine.query(
        "What are the keys to building a career in AI?"
    )
    
    display_response(window_response)
    
    """
    Final Response: The keys to building a career in AI are learning foundational technical skills, working on projects, and finding a job, all of which is supported by being part of a community.
    """

## Putting it all together
    
    
    import os
    from llama_index import ServiceContext, VectorStoreIndex, StorageContext
    from llama_index.node_parser import SentenceWindowNodeParser
    from llama_index.indices.postprocessor import MetadataReplacementPostProcessor
    from llama_index.indices.postprocessor import SentenceTransformerRerank
    from llama_index import load_index_from_storage
    from llama_index.llms import OpenAI
    
    
    def build_sentence_window_index(
        documents,
        llm,
        embed_model="local:BAAI/bge-small-en-v1.5",
        sentence_window_size=3,
        save_dir="sentence_index",
    ):
        # create the sentence window node parser w/ default settings
        node_parser = SentenceWindowNodeParser.from_defaults(
            window_size=sentence_window_size,
            window_metadata_key="window",
            original_text_metadata_key="original_text",
        )
        sentence_context = ServiceContext.from_defaults(
            llm=llm,
            embed_model=embed_model,
            node_parser=node_parser,
        )
        if not os.path.exists(save_dir):
            sentence_index = VectorStoreIndex.from_documents(
                documents, service_context=sentence_context
            )
            sentence_index.storage_context.persist(persist_dir=save_dir)
        else:
            sentence_index = load_index_from_storage(
                StorageContext.from_defaults(persist_dir=save_dir),
                service_context=sentence_context,
            )
    
        return sentence_index
    
    
    def get_sentence_window_query_engine(
        sentence_index, similarity_top_k=6, rerank_top_n=2
    ):
        # define postprocessors
        postproc = MetadataReplacementPostProcessor(target_metadata_key="window")
        rerank = SentenceTransformerRerank(
            top_n=rerank_top_n, model="BAAI/bge-reranker-base"
        )
    
        sentence_window_engine = sentence_index.as_query_engine(
            similarity_top_k=similarity_top_k, node_postprocessors=[postproc, rerank]
        )
        return sentence_window_engine
    
    index = build_sentence_window_index(
        [document],
        llm=OpenAI(model="gpt-3.5-turbo", temperature=0.1),
        save_dir="./sentence_index",
    )
    
    query_engine = get_sentence_window_query_engine(index, similarity_top_k=6)

[![](DeepLearning%20AI/Untitled%2016.png)](<DeepLearning%20AI/Untitled%2016.png>)

[![](DeepLearning%20AI/Untitled%2017.png)](<DeepLearning%20AI/Untitled%2017.png>)

[![](DeepLearning%20AI/Untitled%2018.png)](<DeepLearning%20AI/Untitled%2018.png>)

## TruLens Evaluation
    
    
    from trulens_eval import Tru
    from utils import get_prebuilt_trulens_recorder
    
    eval_questions = []
    with open('generated_questions.text', 'r') as file:
        for line in file:
            # Remove newline character and convert to integer
            item = line.strip()
            eval_questions.append(item)
    
    
    def run_evals(eval_questions, tru_recorder, query_engine):
        for question in eval_questions:
            with tru_recorder as recording:
                response = query_engine.query(question)
    
    Tru().reset_database()

## Variable sentence window sizes
    
    
    sentence_index_1 = build_sentence_window_index(
        documents,
        llm=OpenAI(model="gpt-3.5-turbo", temperature=0.1),
        embed_model="local:BAAI/bge-small-en-v1.5",
        sentence_window_size=1,
        save_dir="sentence_index_1",
    )
    
    sentence_window_engine_1 = get_sentence_window_query_engine(
        sentence_index_1
    )
    
    tru_recorder_1 = get_prebuilt_trulens_recorder(
        sentence_window_engine_1,
        app_id='sentence window engine 1'
    )
    
    run_evals(eval_questions, tru_recorder_1, sentence_window_engine_1)

Note that running an evaluation on more than one question can take some time, so we recommend choosing one of these files (with 5 questions each) to run and explore the results.

  * For evaluating a personal project, an eval set of 20 is reasonable.

  * For evaluating business applications, you may need a set of 100+ in order to cover all the use cases thoroughly.

  * Note that since API calls can sometimes fail, you may occasionally see null responses, and would want to re-run your evaluations. So running your evaluations in smaller batches can also help you save time and cost by only re-running the evaluation on the batches with issues.

Auto-merging Retrieval

[![](DeepLearning%20AI/Untitled%2019.png)](<DeepLearning%20AI/Untitled%2019.png>)
    
    
    from llama_index import Document
    
    document = Document(text="\n\n".join([doc.text for doc in documents]))
    from llama_index.node_parser import HierarchicalNodeParser
    
    # create the hierarchical node parser w/ default settings
    node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=[2048, 512, 128]
    )
    nodes = node_parser.get_nodes_from_documents([document])
    from llama_index.node_parser import get_leaf_nodes
    
    leaf_nodes = get_leaf_nodes(nodes)
    print(leaf_nodes[30].text) 
    
    
    import os
    
    from llama_index import (
        ServiceContext,
        StorageContext,
        VectorStoreIndex,
        load_index_from_storage,
    )
    from llama_index.node_parser import HierarchicalNodeParser
    from llama_index.node_parser import get_leaf_nodes
    from llama_index import StorageContext, load_index_from_storage
    from llama_index.retrievers import AutoMergingRetriever
    from llama_index.indices.postprocessor import SentenceTransformerRerank
    from llama_index.query_engine import RetrieverQueryEngine
    
    
    def build_automerging_index(
        documents,
        llm,
        embed_model="local:BAAI/bge-small-en-v1.5",
        save_dir="merging_index",
        chunk_sizes=None,
    ):
        chunk_sizes = chunk_sizes or [2048, 512, 128]
        node_parser = HierarchicalNodeParser.from_defaults(chunk_sizes=chunk_sizes)
        nodes = node_parser.get_nodes_from_documents(documents)
        leaf_nodes = get_leaf_nodes(nodes)
        merging_context = ServiceContext.from_defaults(
            llm=llm,
            embed_model=embed_model,
        )
        storage_context = StorageContext.from_defaults()
        storage_context.docstore.add_documents(nodes)
    
        if not os.path.exists(save_dir):
            automerging_index = VectorStoreIndex(
                leaf_nodes, storage_context=storage_context, service_context=merging_context
            )
            automerging_index.storage_context.persist(persist_dir=save_dir)
        else:
            automerging_index = load_index_from_storage(
                StorageContext.from_defaults(persist_dir=save_dir),
                service_context=merging_context,
            )
        return automerging_index
    
    
    def get_automerging_query_engine(
        automerging_index,
        similarity_top_k=12,
        rerank_top_n=6,
    ):
        base_retriever = automerging_index.as_retriever(similarity_top_k=similarity_top_k)
        retriever = AutoMergingRetriever(
            base_retriever, automerging_index.storage_context, verbose=True
        )
        rerank = SentenceTransformerRerank(
            top_n=rerank_top_n, model="BAAI/bge-reranker-base"
        )
        auto_merging_engine = RetrieverQueryEngine.from_args(
            retriever, node_postprocessors=[rerank]
        )
        return auto_merging_engine

## Two layer tree
    
    
    from llama_index.llms import OpenAI
    
    index = build_automerging_index(
        [document],
        llm=OpenAI(model="gpt-3.5-turbo", temperature=0.1),
        save_dir="./merging_index",
    )
    query_engine = get_automerging_query_engine(index, similarity_top_k=6)
    
    
    from utils import get_prebuilt_trulens_recorder
    
    auto_merging_index_0 = build_automerging_index(
        documents,
        llm=OpenAI(model="gpt-3.5-turbo", temperature=0.1),
        embed_model="local:BAAI/bge-small-en-v1.5",
        save_dir="merging_index_0",
        chunk_sizes=[2048,512], # each parent (2048) will have 4 leaf nodes (512)
    )
    
    auto_merging_engine_0 = get_automerging_query_engine(
        auto_merging_index_0,
        similarity_top_k=12,
        rerank_top_n=6,
    )
    
    tru_recorder = get_prebuilt_trulens_recorder(
        auto_merging_engine_0,
        app_id ='app_0'
    )
    
    eval_questions = []
    with open('generated_questions.text', 'r') as file:
        for line in file:
            # Remove newline character and convert to integer
            item = line.strip()
            eval_questions.append(item)
    
    def run_evals(eval_questions, tru_recorder, query_engine):
        for question in eval_questions:
            with tru_recorder as recording:
                response = query_engine.query(question)
    
    run_evals(eval_questions, tru_recorder, auto_merging_engine_0)

## Three layers tree
    
    
    auto_merging_index_1 = build_automerging_index(
        documents,
        llm=OpenAI(model="gpt-3.5-turbo", temperature=0.1),
        embed_model="local:BAAI/bge-small-en-v1.5",
        save_dir="merging_index_1",
        chunk_sizes=[2048,512,128], # change to three layers
    )
    
    # ... same as before

[![](DeepLearning%20AI/Untitled%2020.png)](<DeepLearning%20AI/Untitled%2020.png>)

[![](DeepLearning%20AI/Untitled%2021.png)](<DeepLearning%20AI/Untitled%2021.png>)

[![](DeepLearning%20AI/Untitled%2022.png)](<DeepLearning%20AI/Untitled%2022.png>)

Finetuning LLMs

By Lamini

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/finetuning-large-language-models/lesson/1/introduction](<https://learn.deeplearning.ai/finetuning-large-language-models/lesson/1/introduction>)

Why finetune

Where finetuning fits in

Instruction finetuning

Data preparation

Training Process

Evaluation and iteration

Considerations on getting started

Understanding and applying text embeddings

By Google Cloud

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/google-cloud-vertex-ai/lesson/1/introduction](<https://learn.deeplearning.ai/google-cloud-vertex-ai/lesson/1/introduction>)

Getting started with text embeddings

Understanding text embeddings

Visualizing embeddings

Applications of embeddings

Text generation with Vertex AI

Building a Q&A System using semantic search

GCS setup

Conclusion

Vector Databases: from Embeddings to Applications

By Weaviate

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/vector-databases-embeddings-applications/lesson/1/introduction](<https://learn.deeplearning.ai/vector-databases-embeddings-applications/lesson/1/introduction>)

How to obtain vector representation of data

Search for similar vectors

Approximate nearest neighbours

Vector DBs

Sparse, dense and hybrid search

Application - multilingual search

Conclusion

LLMs with semantic search

By Cohere

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/large-language-models-semantic-search/lesson/1/introduction](<https://learn.deeplearning.ai/large-language-models-semantic-search/lesson/1/introduction>)

Keyword Search

Embeddings

Dense retrieval

Rerank

Generating Answers

Conclusion

Evaluating and Debugging Generative AI

By Weights&Biases

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/evaluating-debugging-generative-ai/lesson/1/introduction](<https://learn.deeplearning.ai/evaluating-debugging-generative-ai/lesson/1/introduction>)

Instrument W&B

Training a diffusion model with W&B

Evaluating diffusion models

LLM evaluation and tracing with W&B

Finetuning a language model

Conclusion

Building Systems with ChatGPT API

By OpenAI

<https://learn.deeplearning.ai/chatgpt-building-system/lesson/1/introduction>

Language Models, the Chat format and tokens

Classification

Moderation

Chain of thought reasoning

Chaining prompts

Check outputs

Evaluation

Evaluation II

Evaluation III

Summary

Building Generative AI applications with Gradio

By HuggingFace

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/huggingface-gradio/lesson/1/introduction](<https://learn.deeplearning.ai/huggingface-gradio/lesson/1/introduction>)

NLP tasks interface

Image captioning app

Image generation app

Describe and generate game

Chat with any LLM

Conclusion

How diffusion models work

By Deeplearning.AI

[DLAI - Learning Platform Beta![](https://learn.deeplearning.ai/dlai_icon.svg)https://learn.deeplearning.ai/diffusion-models/lesson/1/introduction](<https://learn.deeplearning.ai/diffusion-models/lesson/1/introduction>)

Intuition

Sampling

Neural Network

Training

Controlling

Speeding Up

Conclusion